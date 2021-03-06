import React, { useContext, useEffect, useState } from 'react';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  SearchBox,
  PopOver,
  Badge,
  MenuItemGroup,
  MenuDropdown,
  Spinner,
  useSearchBox,
  MediaModal,
  DotsVerticalIcon,
} from "src/components";
import classNames from "classnames";
import {
  useDebounce,
  useFeatures,
  useTests,
  useRun,
  useProject,
  useRuns,
} from "src/utils/hooks";
import { ProtectRoute } from "src/context";
import {
  CheckCircleIcon,
  ClockIcon,
  TagSolidIcon,
  BeakerIcon,
  CrossCircleIcon,
  ExclamationSolidIcon,
} from "src/components";
import { format } from "date-fns";
import { customFormatDuration, getTotalBy } from "src/utils";
import { Feature, Run as ApiRun, updateTest} from "src/api";
import { useRouter } from "next/router";
import Link from 'next/link';
import { CursorWaitContext } from 'src/context/cursor-wait-context';

interface FeatureItemProps {
  name: string;
  status: string;
  isActive?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

// @ts-ignore
const FeatureContext = React.createContext();

function FeatureProvider(props) {
  const [feature, setFeature] = React.useState<Feature>(null);
  const value = { feature, setFeature };
  return <FeatureContext.Provider value={value} {...props} />;
}

function useFeature() {
  const context = React.useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }
  return context;
}

// @ts-ignore
const FiltersContext = React.createContext();

function FiltersProvider(props) {
  const [filters, setFilters] = React.useState({all:true, pass:false, fail:true});
  const value = { filters, setFilters };
  return <FiltersContext.Provider value={value} {...props} />;
}

function useFilters() {
  const context = React.useContext(FiltersContext);
  if (!context) {
    throw new Error("Filters must be used within a FiltersProvider");
  }
  return context;
}


// @ts-ignore
const ScrollableContext = React.createContext();

function ScrollableProvider(props) {
  const [scrollable, setScrollable] = React.useState(false);
  const value = { scrollable, setScrollable };
  return <ScrollableContext.Provider value={value} {...props} />;
}

function useScrollable() {
  const context = React.useContext(ScrollableContext);
  if (!context) {
    throw new Error("Scrollable must be used within a ScrollableProvider");
  }
  return context;
}

function StatusBadge({ status }) {
  return <Badge label={status} color={status.toUpperCase() === "pass".toUpperCase() ? "green" : "red"} />;
}

function FeatureItem({ name, status, isActive, onClick }: FeatureItemProps) {
  return (
    <li
      className={classNames(
        "flex",
        "justify-between",
        "py-3",
        "px-4",
        "items-center",
        "hover:bg-gray-100",
        "cursor-pointer",
        { "border-l-2 border-indigo-600": isActive }
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="font-medium text-sm">{name}</div>
        {isActive ? (
          <div className="text-indigo-600 w-5 h-5 ml-2">
            <CheckCircleIcon />
          </div>
        ) : null}
      </div>
      <StatusBadge status={status} />
    </li>
  );
}

function ErrorStateMenuDropdown({ id, errors, featureId }) {
  //@ts-ignore
  const { setCursorWait } = useContext(CursorWaitContext)
  
  const { query } = useRouter();
  const { mutateTests } = useTests({ "deep-populate": true, id: featureId });
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState } = project ?? {};

  const updateErrorState = (error) => async (event) => {
    event.stopPropagation();
    setCursorWait(true)
    const { status } = await updateTest({ id, errorStates: [error] });

    if (status === 201) {
      await mutateTests()
      setCursorWait(false)
    }
  }

  return (
    <MenuDropdown
      items={[
        errorState?.map((error) => ({
          label: error,
          onClick: updateErrorState(error),
          selected: errors ? errors.includes(error) : false,
          style: {paddingRight:'3rem'},
        })),
      ]}
      label={
        <div className="h-5 w-5">
          <DotsVerticalIcon />
        </div>
      }
      className="text-gray-600 hover:bg-gray-300 hover:text-gray-700 py-2 rounded"
      classNamePositionDrop="origin-top-right right-0 mt-2"
    />
  );
}

function Search({ selectedFeatureId }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);

  // @ts-ignore
  const { filters, setFilters } = useFilters()
  const { all } = filters

  // @ts-ignore
  const { setFeature } = useFeature();
  const debouncedSearch = useDebounce(value, 500);
  const [visible, setVisible] = React.useState(false);
  
  const handleSelect = (feature) => (event) => {
    event.stopPropagation();
    setFilters({...filters, all:false})
    setFeature(feature);
  };
  
  useEffect(() => {
    if (all) {
      setFeature(null);
    }
  }, [all])
  
  return (
    <div className="py-4 w-1/2 relative">
      <SearchBox
        inputProps={getInputProps({
          onChange: (e) => console.log(e.target.value),
          onFocus: () => setVisible(true),
          placeholder: "Search feature...",
        })}
        resetterProps={getResetterProps({})}
        fullWidth
      />
      <PopOver
        visible={visible}
        className="bg-white origin-top-left mt-2 w-full overflow-y-auto border"
        style={{ maxHeight: 400 }}
        onClose={() => setVisible(false)}
      >
        <MenuItemGroup>
          {features?.content
            .filter(({ name }) => name.toLowerCase().includes(debouncedSearch.toLowerCase())).map((feature) => (
              <FeatureItem
                key={feature.id}
                name={feature.name}
                status={feature.status}
                isActive={selectedFeatureId === feature.id}
                onClick={handleSelect(feature)}
              />
            ))}
        </MenuItemGroup>
      </PopOver>
    </div>
  );
}

function DataDisplay({ label, value }) {
  return (
    <>
      <span className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
        {label}
      </span>
      <span className="ml-2 font-medium text-xl">{value}</span>
    </>
  );
}

interface SummaryProps {
  run?: ApiRun;
}

const Summary = React.memo(function Summary({ run }: SummaryProps) {
  return (
    <div className="leading-none">
      <span className="">
        <DataDisplay
          label="Features"
          value={getTotalBy("feature", run)}
        />
      </span>
      <span className="ml-6">
        <DataDisplay
          label="Scenarios"
          value={getTotalBy("scenario", run)}
        />
      </span>
      <span className="ml-6">
        <DataDisplay label="Steps" value={getTotalBy("steps", run)} />
      </span>
    </div>
  );
});

function StepWrapper({ children }) {
  return <ul className="space-y-2">{children}</ul>;
}

function Step({ status, name, logs }) {
  // console.log(logs)
  return (
    <React.Fragment>
      <li className="flex items-center text-sm">
        <div
          className={classNames(
            { "text-red-600": status.toUpperCase() === "fail".toUpperCase() },
            { "text-green-600": status.toUpperCase() === "pass".toUpperCase() },
            "w-5",
            "h-5",
            "mr-2"
          )}
        >
          {status.toUpperCase() === "pass".toUpperCase() ? <CheckCircleIcon /> : <CrossCircleIcon />}
        </div>     
        <div className="w-full">{name}</div>
      </li>
      
      {logs.length > 0 ? 
          <Logs {...{ logs }} />
        : ""
      }
    </React.Fragment>
    
  );
}

function Logs({logs}) {
  return (
    
    logs?.map(({test, status, details, media}) =>  (

      <React.Fragment key={test}>

          {details != '' ? 
                <li className="flex items-center text-sm details-node-html" 
                    dangerouslySetInnerHTML={{__html: details}}></li>   
          :""}

          { media != null ? 
              media?.map(() =>  (
                <li key={test} className="flex items-center text-sm"> 
                  <MediaModal {...{testId:test}} /> 
                </li>
              ))
              :""}
        </React.Fragment>
      )
    )
  );
}

function TestCard({ id, name, steps = [], errors, featureName, featureId, status }) {
  const { asPath } = useRouter();
  return (
    <div className="mt-4 border border-gray-300 rounded-md p-4">
      <div className="mb-3">
        <div className="">
          <span className="text-sm font-medium">{name}</span>
          <div className="flex float-right">
            <div className="self-center">
              <a className="mx-3 px-3 py-1 rounded bg-blue-600 font-medium text-sm text-white tracking-tight transition duration-200 hover:bg-blue-700" href={`${asPath && asPath}/compare/${name}`} >Compare</a>
            </div>
            <span>{status.toUpperCase() === "fail".toUpperCase() && <ErrorStateMenuDropdown {...{ id, errors, featureId }} />}</span>
          </div>
        </div>
        {featureName && <p className="mt-2 px-2 inline-block rounded bg-gray-600 text-sm font-medium text-white">Feature: {featureName}</p>}
        {errors?.length > 0 && (
          <div className="flex items-center">
            <div className="font-medium text-sm">Exceptions</div>
            {errors.map((error) => (
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
        )}
      </div>
      <StepWrapper>
        {steps?.map(({ id, status, name, logs }) => (
          <Step key={id} {...{ id, status, name, logs }} />
        ))}

        {/* {steps?.map(({ logs }) => (
          <ErrorDetails {...{ logs }} />
        ))} */}
        
      </StepWrapper>
    </div>
  );
}

function ScenarioHeader({ id, name, duration, tags, status, errors, featureName }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  return (
    <div className="border-b -mx-4 py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="font-medium text-sm">{name}</div>
          <div className="ml-4">
            {formattedDuration ? (
              <div className="flex items-center">
                <div className="w-4 h-4 text-gray-500 mr-1">
                  <ClockIcon />
                </div>
                <span className="block text-gray-500 text-sm" title="Duration">
                  {formattedDuration}
                </span>
              </div>
            ) : null}
          </div>
          <div className="ml-4">
            {tags?.map((tag) => (
              <Badge
                key={tag}
                IconComponent={
                  <div className="text-gray-700 w-3 h-3 mr-2">
                    <TagSolidIcon />
                  </div>
                }
                uppercase={false}
                color="gray"
                label={tag}
              />
            ))}
          </div>
          <StatusBadge status={status} />
        </div>
        {/* {errors && <ErrorStateMenuDropdown {...{ id, errors }} />} */}
      </div>
      {featureName && <p className="mt-2 px-2 inline-block rounded bg-gray-600 text-sm font-medium text-white">Feature: {featureName}</p>}
    </div>
  );
}

function ScenarioOutlineContent({ bddType, nodes, description, featureName, featureId }) {
  if (bddType === "Scenario Outline") {
    return (
      <div className="py-6">
        <div className="text-sm font-medium mb-4">Datos iniciales</div>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        {nodes?.map((test) => {
          const { id, name, nodes: steps, errorStates, status } = test;
          return (
            <TestCard key={id} {...{ id, name, steps, errors: errorStates, featureName, featureId, status }} />
          );
        })}
      </div>
    );
  }

  return (
    <StepWrapper>
      {nodes?.map(({ id, status, name, logs }) => {
        <Step key={id} {...{ id, status, name, logs }} />
        })}

      {/* {nodes?.map(({ logs }) => (
        <ErrorDetails {...{ logs }} />
        ))} */}

    </StepWrapper>
  );
}

function ScenarioContent({ scenario, featureName, featureId }) {
  const {
    id,
    name,
    description,
    nodes,
    bddType,
    errorStates,
    status,
  } = scenario;
  if (bddType === "Scenario") {
    return (
      <div className="py-6">
        <div dangerouslySetInnerHTML={{ __html: description }} />
            <TestCard key={id} {...{ id, name, steps: nodes, errors: errorStates, featureId, status, }} featureName={null} />
      </div>
    );
  }

  return (
    <StepWrapper>
      {nodes?.map(({ id, status, name, logs }) => {
        <Step key={id} {...{ id, status, name, logs }} />
        })}

      {/* {nodes?.map(({ logs }) => (
        <ErrorDetails {...{ logs }} />
        ))} */}

    </StepWrapper>
  );
}

function ScenarioCard({ scenario, featureName, featureId }) {
  // @ts-ignore
  const { setScrollable } = useScrollable()
  useEffect(() => {
    setScrollable(true)
  }, [])
  const {
    id,
    name,
    status,
    duration,
    categoryNameList,
    description,
    nodes,
    bddType,
    errorStates,
  } = scenario;
  return (
    <div className={`${!!featureName ? "px-6 py-4 " : ""}flex-auto`}>
      <div className="space-y-8">
        <div className="rounded-md border px-4 mt-6">
          <ScenarioHeader
            {...{
              id,
              name,
              duration,
              status,
              tags: categoryNameList,
              errors: errorStates,
              featureName
            }}
          />
          <ScenarioOutlineContent {...{ bddType, nodes, description, featureName, featureId }} />
          <ScenarioContent {...{ scenario, featureName, featureId }} />
        </div>
      </div>
    </div>
  );
}

function FeatureEmptyPlaceholder() {
  return (
    <div className="h-full flex-center flex-col font-medium text-gray-500 bg-gray-100">
      <div className="w-16 h-16 mb-4">
        <BeakerIcon />
      </div>
      <p className="text-center">
        Selecciona una feature del buscador <br />
        para ver el detalle.
      </p>
    </div>
  );
}

function FeatureHeading({ created, name, tags }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-medium">{name}</div>
          <div className="text-sm mt-1">
            Created on {format(new Date(created), "dd/MM/yyyy HH:ss")}
          </div>
          <div className="-mx-2">
            {tags?.map((tag) => (
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
        <div>
          {/* <Button label="Editar" variant="white" color="indigo" /> */}
          &nbsp;
        </div>
      </div>
    </div>
  );
}
// ============ componentes para todos los features ============
function AllFeaturesContent({ features }) {
  const { name, startTime, categoryNameList, id } = features ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  return (
    <>
      {isLoading ? (
        <div className="px-6 py-4 h-full flex-none">
          <div className="flex-center" style={{height: "80%"}}>
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        </div>
      ) : (
        <>
          {child?.map((scenario) => {
            return <ScenarioCard key={scenario.id} scenario={scenario} featureName={name} featureId={id}/>
          })}
        </>
      )}
    </>
  );
}

function AllFilterContent({ features, status }) {
  const { name, id, } = features ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  return (
    <>
      {isLoading ? (
        <div className="px-6 py-4 h-full flex-none">
          <div className="flex-center" style={{height: "80%"}}>
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        </div>
      ) : (
        <>
          {child?.map((scenario) => {
            if (scenario?.status.toUpperCase() === status.toUpperCase()) {
              return <ScenarioCard key={scenario.id} featureName={name} featureId={id} scenario={scenario} />
            }
          })}
        </>
      )}
    </>
  );
}

function AllFeatures({features}) {
  // @ts-ignore
  const { filters } = useFilters()
  const { all, fail, pass} = filters
  
  if (!fail && !pass) {
    return all && <AllFeaturesContent features={features} />
  } else {
    return (
      <>
        {fail && <AllFilterContent features={features} status={'fail'}/>}
        {pass && <AllFilterContent features={features} status={'pass'}/>}
      </>
    )
  }
}

// ============ componentes para un solo featurea ============ 
function OneFeatureContent({ feature }) {
  const { name, startTime, categoryNameList, id } = feature ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  if (!feature) {
    return <FeatureEmptyPlaceholder />;
  }

  return (
    <div className="px-6 py-4 flex-auto">
      <FeatureHeading name={name} created={startTime} tags={categoryNameList} />
      <>
        {isLoading ? (
          <div className="flex-center mt-20">
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        ) : (
          child?.map((scenario) => {
            return <ScenarioCard key={scenario.id} scenario={scenario} featureName={null} featureId={id} />;
          })
        )}
      </>
    </div>
  );
}

function OneFilterContent({ feature, status }) {
  const { name, startTime, categoryNameList, id } = feature ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  return (
    <>
      {isLoading ? (
        <div className="px-6 py-4 h-full flex-none">
          <div className="flex-center" style={{height: "80%"}}>
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 flex-auto">
          <FeatureHeading name={name} created={startTime} tags={categoryNameList} />
          <div className="space-y-8">
            {child?.map((scenario) => {
              if (scenario?.status.toUpperCase() === status.toUpperCase()) {
                return <ScenarioCard key={scenario.id} featureName={null} featureId={id} scenario={scenario} />
              }
            })}
          </div>
        </div>
      )}
    </>
  );
}

function OneFeature({feature}) {
  // @ts-ignore
  const { filters } = useFilters()
  const { all, fail, pass} = filters

    if (!fail && !pass) {
      return !all && <OneFeatureContent feature={feature} />
    } else {
      return (
        <>
          {fail && <OneFilterContent feature={feature} status={'fail'}/>}
          {pass && <OneFilterContent feature={feature} status={'pass'}/>}
        </>
      )
    }
}

// ============ wrapper para los dos tipos de features ============ 
function FeatureWrapper({feature, features}) {
  return (
    <>
      {feature ? <OneFeature feature={feature} /> : features?.content.map((f)=>{
        return <AllFeatures key={f?.id} features={f}/>
      })}
    </>
  )
}

function ButtonsFilters({errorState, asPath}) {
  // @ts-ignore
  const { filters, setFilters } = useFilters()
  const {all, fail, pass} = filters

  const handleAll = () => {
    setFilters({...filters, all:true})
  }
  const handlePass = () => {
    setFilters({...filters, pass:!pass, fail:false})
  }
  const handleFail = () => {
    setFilters({...filters, pass:false, fail:!fail})
  }
  return (
    <div className="py-4 w-1/2 self-center">
        <div className='ml-3 inline-block'>
          <span onClick={handleAll} className={`${all && "outline-gray"} mx-2 px-3 py-1 cursor-pointer rounded bg-gray-100 font-medium text-sm text-gray-700 transition duration-200 hover:bg-gray-100`}>All Scenarios</span>
          <span onClick={handlePass} className={`${pass && "outline-green"} mx-2 px-3 py-1 cursor-pointer rounded bg-green-300 font-medium text-sm text-green-800 transition duration-200 hover:bg-green-400`}>Pass</span>
          <span onClick={handleFail} className={`${fail && "outline-red"} mx-2 px-3 py-1 cursor-pointer rounded bg-red-300 font-medium text-sm text-red-800 transition duration-200 hover:bg-red-400`}>Fail</span>
        </div>
        {errorState &&
          <div className="float-right">
            <a
              className="cursor-pointer mx-2 px-3 py-1 rounded bg-blue-600 font-medium text-sm text-white tracking-tight transition duration-200 hover:bg-blue-700"
              href={`${asPath && asPath}/state`}
            >
                Error States
            </a>
          </div>
        }
    </div>
  )
}

function ButtonsWrapper({ children }) {
  return (
    <div
      className={classNames(
        "px-6",
        "py-4",
        "border-b",
        "w-full",
        "flex",
      )}
    >
      {children}
    </div>
  );
}

function Breadcrumd({project, runName, runs}) {
  return (
    <nav className="w-full">
      <ol className="flex w-full text-grey">
        <li className="flex self-center">
          <button className="w-full font-semibold cursor-default focus:outline-none"><Link href={`/projects/${project?.id}`}><a>{`${project?.name}`}</a></Link></button>
          <span className="self-center w-3 mx-2">
            <img className="w-full" src={"/assets/arrow-right.png" }  alt={"arrow-right"}/>
          </span>
        </li>
        <MenuDropdown
          label={runName}
          items={[
            runs?.content.map((run) => ({
              label: run?.name,
              style: {paddingRight:'3rem'},
              href: `/projects/${project?.id}/runs/${run?.id}`,
              selected: run?.name ? run?.name.includes(runName) : false,
            })),
          ]}
          classNamePositionDrop="origin-top-left left-0 mt-2"
        />
      </ol>
    </nav>
  )
}

function Run() {
  const { query, asPath } = useRouter();
  const { features } = useFeatures(query.rid as string);
  const { runs } = useRuns({
    projectId: query.id as string,
  });
  
  // @ts-ignore
  const { feature } = useFeature();
  const { id } = feature ?? {};
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState } = project ?? {};

  // @ts-ignore
  const { scrollable } = useScrollable()
  return (
    <Layout>
        <LayoutHeader>
          <div className="flex space-x-4">
            {project?.name !== undefined && <Breadcrumd project={project} runName={run?.name} runs={runs}/>}
          </div>
          <Summary run={run} />
        </LayoutHeader>
        <LayoutContent scrollable={scrollable}>
          <ButtonsWrapper>
            <Search selectedFeatureId={id} />
            <ButtonsFilters errorState={errorState} asPath={asPath} />
          </ButtonsWrapper>
          <FeatureWrapper feature={feature} features={features}/>
        </LayoutContent>
    </Layout>
  );
}

function RunWithProvider() {
  return (
    <FeatureProvider>
      <FiltersProvider >
        <ScrollableProvider>
          <Run />
        </ScrollableProvider>
      </FiltersProvider>
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
