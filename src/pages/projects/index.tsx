import React, { useEffect, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Project, removeProject } from "src/api";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Members,
  Badge,
  SearchBox,
  Button,
  Table,
  MenuDropdown,
  Spinner,
  Title,
  useSearchBox,
  DotsVerticalIcon,
} from "src/components";
import { ProtectRoute, useAlert, useNotification } from "src/context";
import {
  useModal,
  useProjects,
  usePagination,
  prefetchProject,
  useProject,
  useRuns,
} from "src/utils/hooks";
import { useRouter } from "next/router";

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  const filter = (e) => {
    const searchText = e.target.value;

      onSearch(searchText);
    
  
  };
  
  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        fullWidth
        inputProps={getInputProps({
          onChange: filter,
          placeholder: "Search",
        })}
        resetterProps={getResetterProps({ onClick: () => {} })}
      />
    </div>
  );
}

// Principal
export function Home() {
  const [filters, setFilters] = React.useState({
    page: 0,
    size: 5,
    name: ""
  });
  const { query } = useRouter();
  const { mutateProject } = useProject(query.id as string);
  const alert = useAlert();
  const notitication = useNotification();
  const { projects, isLoading } = useProjects(filters);
  const { PaginationComponent, currentPage } = usePagination<Project[]>({
    paginatedObject: projects,
  });

  React.useEffect(() => {
    setFilters({ ...filters, page: currentPage });
  }, [currentPage]);


  const handleDeleteProject = ({ name, id }) => (e) => {
    
    const onConfirm = async () => {
      try {
        await removeProject(id);
        mutateProject();
        notitication.show({
          title: "Exito",
          type: "success",
          message: `The project "${name}" has been successfully removed.`,
        });
      } catch (error) {
        notitication.show({
          title: "Error",
          type: "error",
          message: `An error occurred while trying to delete the project. Try again later.`,
        });
      }
    };

    alert.show({
      title: `Delete "${name}"`,
      body:
        `Are you sure you want to delete "${name}"? All associated data will be lost.`,
      onConfirm,
      action: "Delete",
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        headerClassName: "px-6 w-1/3",
        className: "px-6",
        Cell: ({ row }) => {
          const { name, runQuantity, testQuantity, id } = row.original;
          return (
            <div className="flex flex-col">
              <Link href={`/projects/${id}`}>
                <a
                  className="text-sm leading-5 font-medium text-gray-900 hover:text-gray-700 underline"
                  onMouseEnter={() => prefetchProject(id)}
                >
                  {name}
                </a>
              </Link>
              <div className="text-sm leading-8 text-gray-600">
                {runQuantity} Runs &middot; {testQuantity} Tests
              </div>
            </div>
          );
        },
      },
      {
        Header: "Usernames",
        id: "members",
        headerClassName: "px-6",
        className: "px-6",
        Cell: ({ row }) => <Members members={row.original.users} />,
      },
      {
        Header: "Last Build",
        id: "status",
        headerClassName: "px-6",
        className: "px-6",
        Cell: ({ row }) => {
          const {
            lastRun: { status },
          } = row.original;
          return (
            <Badge label={status} color={status.toUpperCase() === "pass".toUpperCase() ? "green" : "red"} />
          );
        },
      },
      {
        Header: "Created",
        id: "created",
        headerClassName: "px-6",
        className: "px-6",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:ss")}
          </span>
        ),
      },
      {
        Header: () => null,
        id: "edit",
        Cell: ({ row }) => (
          <MenuDropdown
            items={[
              [{ label: "Delete", style: {paddingRight:'3rem', paddingBottom:'0.25rem', paddingTop:'0.25rem'}, onClick: handleDeleteProject(row.original) }],
            ]}
            label={
              <div className="h-5 w-5">
                <DotsVerticalIcon />
              </div>
            }
            className="text-gray-600 hover:bg-gray-300 hover:text-gray-700 py-2 rounded"
            classNamePositionDrop="origin-top-right right-0 mt-2"
          />
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Projects</span>
        <div>
          &nbsp;
          {/* <Button label="Crear proyecto" variant="primary" color="indigo" /> */}
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="px-6 py-4">
          <Title>Filters</Title>
          <Search onSearch={(search: string) => setFilters({page:0, size: 5, name: search})} />
        </div>
        <div className="flex flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex-center flex-1">
              <Spinner className="h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <Table {...{ columns, data: projects?.content }} sticky />
          )}
        </div>
        {PaginationComponent}
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Home);
