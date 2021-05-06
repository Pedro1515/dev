import React, { useContext } from "react";
import format from "date-fns/format";
import { useRouter } from "next/router";
import Link from "next/link";
import { removeRun, Run } from "src/api";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Title,
  Card,
  Table,
  Badge,
  MenuDropdown,
  Spinner,
  PieChart,
  AreaChart,
  Select,
  Option,
  DotsVerticalIcon,
} from "src/components";
import {
  ClockIcon,
  TagSolidIcon,
  ExclamationSolidIcon,
} from "src/components";
import { CursorWaitContext, ProtectRoute, useAlert, useNotification } from "src/context";
import { usePagination, useProject, useRuns } from "src/utils/hooks";
import { config } from "src/utils/tailwind";
import { customFormatDuration, getTotalBy } from "src/utils";
import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip";
import "@reach/tooltip/styles.css";

function DataDisplayWrapper(props) {
  return <div className="flex flex-wrap -mx-6" {...props} />;
}

function DataDisplay({ label, value }) {
  return (
    <div className="flex flex-col my-3 mx-6 xs:w-full">
      <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
        {label}
      </div>
      <div className="mt-2 font-medium text-xl leading-none">{value}</div>
    </div>
  );
}

function Caption(props) {
  return <div className="mt-1 text-xs text-gray-500 font-medium" {...props} />;
}

function RunsTable() {
  // @ts-ignore
  const { cursorWait, setCursorWait } = useContext(CursorWaitContext)

  const { query, route, asPath } = useRouter();
  const { mutateProject } = useProject(query.id as string);
  const [filters, setFilters] = React.useState({
    projectId: query.id as string,
    page: 0,
    size: 5,
  });
  const { runs, isLoading: isLoadingRuns, mutateRuns } = useRuns(filters);
  const { PaginationComponent, currentPage } = usePagination<Run[]>({
    paginatedObject: runs,
  });

  React.useEffect(() => {
    setFilters({ ...filters, page: currentPage });
  }, [currentPage]);

  const alert = useAlert();
  const notitication = useNotification();

  const handleDeleteRun = ({ name, id }) => (e) => {
    const onConfirm = async () => {
      setCursorWait(true)
      try {
        const status = await removeRun(id);
        if (status === 200) {
          setCursorWait(false)
          mutateProject();
          mutateRuns();
          notitication.show({
            title: "Exito",
            type: "success",
            message: `The run "${name}" has been successfully removed.`,
          });
        }
      } catch (error) {
        setCursorWait(false)
        notitication.show({
          title: "Error",
          type: "error",
          message: `An error occurred while trying to delete the run. Try again later.`,
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Run",
        id: "name",
        headerClassName: "w-1/4 pl-6",
        className: "pl-6 pr-0",
        Cell: ({ row }) => {
          const { name, duration, id } = row.original;
          return (
            <div  className="flex flex-col text-sm">
              <Link href={`${asPath}/runs/${id}`}>
                  <a className="overflow-hidden truncate whitespace-nowrap no-underline text-sm leading-5 font-medium text-gray-900 hover:text-gray-700 underline">
                    {name.length > 31 
                    ? (
                      <Tooltip style={{ background: "hsla(0, 0%, 0%, 0.75)", fontSize: "13px", fontWeight: "600", color: "white", border: "none", borderRadius: "4px",}} label={name}>
                        <span>
                          {name}
                        </span>
                      </Tooltip>
                    ) 
                    : (!!name && name) }
                  </a>
              </Link>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 text-gray-500 mr-2">
                    <ClockIcon />
                  </div>
                  <span
                    className="block text-gray-500 text-sm"
                    title="Duration"
                  >
                    {customFormatDuration({ start: 0, end: duration })}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Status",
        id: "status",
        headerClassName: "text-center",
        className: "text-center",
        Cell: ({ row }) => (
          <Badge
            label={row.original.status}
            color={row.original.status.toUpperCase() === "pass".toUpperCase() ? "green" : "red"}
          />
        ),
      },
      {
        Header: "Start time",
        id: "start_time",
        headerClassName: "w-40 text-center",
        className: "text-center",
        Cell: ({ row }) => (
          <span
            className="text-sm leading-5 text-gray-500"
            title={row.original.created}
          >
            {format(new Date(row.original.startTime), "dd/MM/yyyy HH:ss")}
          </span>
        ),
      },
      {
        Header: "Total features",
        id: "total_features",
        headerClassName: "text-center",
        className: "text-center",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {getTotalBy("feature", row.original)}
          </span>
        ),
      },
      {
        Header: "Total scenarios",
        id: "total_scenarios",
        headerClassName: "text-center",
        className: "text-center",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {getTotalBy("scenario", row.original)}
          </span>
        ),
      },
      {
        Header: "Passed",
        id: "passed",
        headerClassName: "text-center",
        className: "text-center text-sm leading-5 text-green-600",
        accessor: "passChildLength",
      },
      {
        Header: "Failed",
        id: "failed",
        headerClassName: "text-center",
        className: "text-center text-sm leading-5 text-red-600 text-center",
        accessor: "failChildLength",
      },
      {
        Header: "Skipped",
        id: "skipped",
        headerClassName: "text-center",
        className: "text-center text-sm leading-5 text-yellow-600 text-center",
        accessor: "skipChildLength",
      },
      {
        Header: () => null,
        id: "edit",
        Cell: ({ row }) => (
          <MenuDropdown
            items={[
              [{ label: "Delete", style: {paddingRight:'3rem', paddingBottom:'0.25rem', paddingTop:'0.25rem'}, onClick: handleDeleteRun(row.original) }],
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
    <>
      <div className="flex flex-1">
        {isLoadingRuns ? (
          <div className="flex-center flex-1">
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        ) : (
          <Table {...{ columns }} data={runs?.content} sticky />
        )}
      </div>
      {PaginationComponent}
    </>
  );
}

function GeneralCard() {
  const { query } = useRouter();
  const { project } = useProject(query.id as string);

  const {
    createdAt,
    runQuantity,
    testQuantity,
    errorState,
    lastRun: { categoryNameList = [] } = {},
  } = project ?? {};

  return (
    <Card className="flex-col w-1/3 border-r divide-y">
      <div className="flex items-center justify-center p-2">
        <div className="w-11/12">
          <Title className="text-gray-700 font-semibold">General</Title>
          <Caption>
            Created on {format(new Date(createdAt || null), "dd/MM/yyyy HH:ss")}
          </Caption>
          <DataDisplayWrapper>
            <DataDisplay label="Project Runs" value={runQuantity} />
            <DataDisplay label="Project Tests" value={testQuantity} />
          </DataDisplayWrapper>
        </div>
      </div>
      <div className="flex items-center justify-center p-2">
        <div className="w-11/12">
          <Title className="text-gray-700 font-semibold">Tags</Title>
          <div className="flex flex-wrap mt-4 -mx-2">
            {categoryNameList?.map((tag) => (
              <Badge
                key={tag}
                IconComponent={
                  <div className="text-gray-700 w-3 h-3 mr-2">
                    <TagSolidIcon />
                  </div>
                }
                className="m-2"
                uppercase={false}
                color="gray"
                label={tag}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-2">
        <div className="w-11/12">
          <Title className="text-gray-700 font-semibold">Exceptions</Title>
          <div className="flex flex-wrap mt-4 -mx-2">
            {errorState?.map((error) => (
              <Badge
                key={error}
                IconComponent={
                  <div className="text-red-700 w-3 h-3 mr-2">
                    <ExclamationSolidIcon />
                  </div>
                }
                className="m-2"
                uppercase={false}
                color="red"
                label={error}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function LastRunCard() {
  const { query } = useRouter();
  const { project } = useProject(query.id as string);
  const [runFilter, setRunFilter] = React.useState<Option>({
    label: "Feature",
    value: "Parent",
  });

  const pieChartData = [
    {
      name: "Pass",
      value: project?.lastRun[`pass${runFilter.value}Length`],
      color: "green",
    },
    {
      name: "Fail",
      value: project?.lastRun[`fail${runFilter.value}Length`],
      color: "red",
    },
  ];

  const { lastRun: { startTime = "", status = "" } = {} } = project ?? {};

  return (
    <Card className="flex-col w-1/3 border-r p-2 px-6">
      <div>
        <div className="flex flex-col">
          <div className="inline-flex justify-between">
            <div>
              <Title className="text-gray-700 font-semibold">Last run</Title>
              <Badge
                className="ml-2"
                label={status}
                color={status.toUpperCase() === "pass".toUpperCase() ? "green" : "red"}
              />
            </div>
            <div className="w-1/3">
              <Select
                name="filter"
                options={[
                  { label: "Feature", value: "Parent" },
                  { label: "Scenario", value: "Child" },
                ]}
                selected={runFilter}
                onSelect={(option) => setRunFilter(option)}
              />
            </div>
          </div>
          <Caption>
            Started on {format(new Date(startTime || null), "dd/MM/yyyy HH:ss")}
          </Caption>
        </div>
        <DataDisplayWrapper>
          <DataDisplay
            label="Total features"
            value={getTotalBy("feature", project?.lastRun)}
          />
          <DataDisplay
            label="Total scenarios"
            value={getTotalBy("scenario", project?.lastRun)}
          />
          <DataDisplay
            label="Total steps"
            value={getTotalBy("steps", project?.lastRun)}
          />
        </DataDisplayWrapper>
        <div className="flex-center">
          <PieChart height={110} data={pieChartData} />
        </div>
      </div>
    </Card>
  );
}

function FailuresCard() {
  const { query } = useRouter();
  const { runs } = useRuns({
    projectId: query.id as string,
  });

  const size = runs?.content.length > 10 ? 10 : runs?.content.length;
  const data = runs?.content.slice(0, 10).map((run, idx) => ({
    idx,
    name: run.name,
    value: run.failChildLength,
  }));

  return (
    <Card className="flex-col w-1/3 p-2">
      <div className="px-6">
        <Title className="text-gray-700 font-semibold">Faults</Title>
        <Caption>Last  {size} runs</Caption>
      </div>
      <div className="flex-center mt-6 mr-6">
        <AreaChart
          data={data}
          xAxisDataKey="idx"
          height={300}
          AreaProps={{
            dataKey: "value",
            fill: config.theme.colors.red[600],
            stroke: config.theme.colors.red[700],
          }}
        />
      </div>
    </Card>
  );
}

function Project() {
  const { query } = useRouter();
  const { project } = useProject(query.id as string);

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">{project?.name}</span>
        </div>
      </LayoutHeader>
      <LayoutContent scrollable>
        <div className="flex border-b">
          <GeneralCard />
          <LastRunCard />
          <FailuresCard />
        </div>
        <RunsTable />
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Project);
