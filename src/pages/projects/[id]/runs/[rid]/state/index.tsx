import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Badge,
  Spinner,
  MediaModal,
  LayoutHeader,
  MenuDropdown,
} from "src/components";
import classNames from "classnames";
import {
  useFeatures,
  useTests,
  useRun,
  useProject,
  useRuns,
} from "src/utils/hooks";
import { ProtectRoute, CursorWaitContext } from "src/context";
import {
  CheckCircleIcon,
  ClockIcon,
  BeakerIcon,
  CrossCircleIcon,
  ExclamationSolidIcon,
} from "src/components";
import { customFormatDuration } from "src/utils";
import { Feature, updateTest } from "src/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FormModal } from "src/components/common";

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
const ErrorStateTestContext = React.createContext();

function ErrorStateTestProvider(props) {
  const [errorStateTest, setErrorStateTest] = React.useState(null);
  const value = { errorStateTest, setErrorStateTest };
  return <ErrorStateTestContext.Provider value={value} {...props} />;
}

function useErrorStateTest() {
  const contextErrorStateTest = React.useContext(ErrorStateTestContext);
  if (!contextErrorStateTest) {
    throw new Error("useErrorStateTest must be used within a ErrorStateTestProvider");
  }
  return contextErrorStateTest;
}

// @ts-ignore
const ModalContext = React.createContext();

function ModalProvider(props) {
  const [modal, setModal] = React.useState({
    modalOpen: false, 
    run:'', 
    project:'',
    testName:'',
    description:'',
  });
  const value = { modal, setModal };
  return <ModalContext.Provider value={value} {...props} />;
}

function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

// @ts-ignore
const ScrollContext = React.createContext();

function ScrollProvider(props) {
  const [scroll, setScroll] = React.useState(false);
  const value = { scroll, setScroll };
  return <ScrollContext.Provider value={value} {...props} />;
}

function useScroll() {
  const contextScroll = React.useContext(ScrollContext);
  if (!contextScroll) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return contextScroll;
}

// agregando features al context
function SetFeatues({ features }) {
  // @ts-ignore
  const { setFeature } = useFeature();
  useEffect(() => {
    setFeature(features);
  }, [features]);

  return <>{/* <h1>{feature.name}</h1> */}</>;
}

function StateItem({ name, isActive, onClick }) {
  return (
    <li
      className={classNames(
        "flex",
        "justify-between",
        "py-3",
        "px-4",
        "items-center",
        "hover:bg-gray-200",
        "cursor-pointer",
        { "border-l-2 border-indigo-600 bg-gray-200": isActive }
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="font-medium text-sm">{name}</div>
      </div>
    </li>
  );
}

function NavMenu({ errorState }) {
  // @ts-ignore
  const { setErrorStateTest } = useErrorStateTest();

  // @ts-ignore
  const { errorStateTest } = useErrorStateTest();
  const handleSelect = (error) => (event) => {
    event.stopPropagation();

    // agregando tests o datos de los tests al context
    setErrorStateTest(error);
  };
  return (
    <nav>
      <div className="p-4">
        <span>States</span>
        <p className="float-right text-white text-sm bg-blue-500 px-2 font-semibold rounded">
          {errorState.length}
        </p>
      </div>
      <ul>
        {errorState.map((error) => {
          return (
            <StateItem
              key={error}
              name={error}
              isActive={error === errorStateTest}
              onClick={handleSelect(error)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function TestEmptyPlaceholder() {
  return (
    <div className="h-full flex-center flex-col font-medium text-gray-600">
      <div className="w-16 h-16 mb-4">
        <BeakerIcon />
      </div>
      <p className="text-center">Select an error status</p>
    </div>
  );
}

function StepWrapper({ children }) {
  return <ul className="space-y-2 py-4">{children}</ul>;
}

function Step({ status, name, logs }) {
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

      {logs.length > 0 ? <Logs {...{ logs }} /> : ""}
    </React.Fragment>
  );
}

function Logs({ logs }) {
  return logs?.map(({ test, status, details, media }) => (
    <React.Fragment>
      {details != "" ? (
        <li
          className="flex items-center text-sm"
          dangerouslySetInnerHTML={{ __html: details }}
        ></li>
      ) : (
        ""
      )}

      {media != null
        ? media?.map(() => (
            <li key={test} className="flex items-center text-sm">
              <MediaModal {...{ testId: test }} />
            </li>
          ))
        : ""}
    </React.Fragment>
  ));
}

function StepsCard({ steps = [], bddType }) {
  return bddType === "Scenario" ? (
    <div className="m-2 shadow border border-gray-300 rounded-md p-4">
      <StepWrapper>
        {steps?.map(({ id, status, name, logs }) => (
          <Step key={id} {...{ id, status, name, logs }} />
        ))}
      </StepWrapper>
    </div>
  ) : (
    <></>
  );
}

function TestCard({ id, name, errorStates, duration, steps, runName, featureId, description, fetureName, errorStateTest, bddType }) {
  //@ts-ignore
  const { cursorWait, setCursorWait } = useContext(CursorWaitContext)

  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  const [actived, setActived] = useState(false);
  const count = Math.random();
  const handleCheckbox = (e) => {
    setActived(e.target.checked);
  };
  const { mutateTests } = useTests({ "deep-populate": true, id: featureId });

  // @ts-ignore
  const { modal, setModal } = useModal();
  
  const handleDeleteState = async (id, errorStateTest) => {
    setCursorWait(true)
    const { status } = await updateTest({ id, errorStates: [errorStateTest] });
    
    if (status === 201) {
      await mutateTests()
      setCursorWait(false)
    }
  };
  
  const handleModal = (name, runName) => {
    setModal({
      ...modal,
      modalOpen: true,
      testName: name,
      run: runName,
    })
  }

  const variants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <>
      <input
        type="checkbox"
        id={`toggle${count}`}
        className="hidden"
        onChange={handleCheckbox}
        />
      <div className="m-3 p-1 rounded border-t border-gray-300 shadow">
        <div>
          <span className="ml-2 text-sm font-medium">{name}</span>
          <div className="h-6 flex float-right">
           <label className={`${cursorWait && "cursor-wait"} w-6 p-1 flex-center cursor-pointer rounded opacity-75 bg-gray-300 transition duration-300 hover:bg-gray-400 mr-3`} htmlFor={`toggle${count}`}>
             <img className="w-full" src={actived ? "/assets/invisible.png" : "/assets/visible.png" }  alt={actived ? "invisible" : "visible"}/>
           </label>
           <button className={`${cursorWait && "cursor-wait"} px-2 flex-center cursor-pointer rounded bg-blue-500 transition duration-300 hover:bg-blue-600 focus:outline-none mr-3 focus:outline-none`} onClick={(e) => {handleModal(name, runName)}}>
             <img className="w-4 mr-1" src="/assets/share-option.png" alt="share-option"/>
             <p className="text-xs text-white font-extrabold">Jira</p>
           </button>
           <button className={`${cursorWait && "cursor-wait"} w-6 p-1 mr-3 flex-center cursor-pointer rounded bg-red-600 transition duration-300 hover:bg-red-700 focus:outline-none onClick`} onClick={(e) => {handleDeleteState(id, errorStateTest)}}>
             <img className="w-full" src="/assets/trash.png" alt="trash"/>
           </button>
          </div>
        </div>
        <div>
          <div className="ml-2 inline-flex text-sm leading-5 font-normal text-gray-800 tracking-wide items-center">
            {fetureName}
          </div>
          <div className="inline-flex leading-5 items-center m-2">
            <div className="flex">
              <div className="w-4 h-4 text-gray-500 mr-1">
                <ClockIcon />
              </div>
              {formattedDuration ? (
                <span
                  className="block text-gray-500 text-sm"
                  title="Duration"
                >
                  {formattedDuration}
                </span>
              ) : null}
            </div>
          </div>
          {errorStates.map((error) => (
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
        <AnimatePresence>
          {actived && (
            <motion.div initial="hidden" animate="visible" variants={variants} exit="exit">
              {description && (
                <div className="m-2">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}
              <StepsCard steps={steps} bddType={bddType}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ScenarioOutline({ scenario1, fetureName, featureId }) {
  const scenarioOutline = scenario1?.bddType;

  // @ts-ignore
  const { errorStateTest } = useErrorStateTest();

  // @ts-ignore
  const { setScroll } = useScroll();
  if (scenarioOutline === "Scenario Outline") {
    const {
      id,
      name,
      errorStates,
      bddType,
      duration,
      endTime,
      description,
      nodes: steps,
      reportName: runName,
    } = scenario1;

    if (errorStates?.includes(errorStateTest)) {
      setScroll(true)
      return (
        <TestCard
            key={id}
            {...{
              id,
              name,
              errorStates,
              bddType,
              duration,
              endTime,
              steps,
              fetureName,
              featureId,
              runName,
              description,
              errorStateTest,
            }}
          />
      )
    } else {return <></>}
  } else {return <></>}
}

function ScenarioContent({ scenario2, fetureName, featureId }) {
  // @ts-ignore
  const { errorStateTest } = useErrorStateTest();
  
  // @ts-ignore
  const { setScroll } = useScroll();

  return (
    <>
      {scenario2?.map((tests) => {
        const {
          id,
          name,
          bddType,
          description,
          errorStates,
          duration,
          endTime,
          nodes: steps,
          reportName:runName,
        } = tests;

        if (errorStates?.includes(errorStateTest)) {
          setScroll(true)
          return (
            <TestCard
              key={id}
              {...{
                id,
                name,
                bddType,
                errorStates,
                duration,
                endTime,
                steps,
                description,
                fetureName,
                featureId,
                runName,
                errorStateTest
              }}
            />
          );
        }
        else {
          return <></>;
        }
      })}
    </>
  );
}

function Scenarios({ features }) {
  const { id } = features ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  const name = f ? f.name : {};
  const fId = f ? f.id : {};

  if (isLoading) {
    return (
      <div className="w-full h-full flex-center">
        <Spinner className="h-10 w-10 text-gray-500" />
      </div>
    );
  } else if (child) {
      return child?.map((scenario1) => {
        const { nodes: scenario2 } = scenario1;
        return (
          <>
            <ScenarioContent
              key={scenario2.id}
              scenario2={scenario2}
              fetureName={name}
              featureId={fId}
            />
            <ScenarioOutline
              key={scenario1.id}
              scenario1={scenario1}
              fetureName={name}
              featureId={fId}
            />
          </>
        );
      });
    } else {return <></>}
}

function Features({ feature }) {
  // @ts-ignore
  const { scroll } = useScroll();  
  return (
    <div className={`h-full pb-10 ${scroll && 'overflow-y-auto'}`}>
      {feature?.map((features) => {
        return <Scenarios key={features.id} features={features} />;
      })}
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

function Content() {
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);
  // @ts-ignore
  const { feature } = useFeature();

  // @ts-ignore
  const { errorStateTest } = useErrorStateTest();
  return (
    <>
      {!errorStateTest && <TestEmptyPlaceholder/>}
      <Features feature={feature} />
      {features && <SetFeatues features={features.content} /> }
    </>
  );
}

const LayoutState = () => {
  const { query } = useRouter();
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState, name } = project ?? {};
  const { runs } = useRuns({
    projectId: query.id as string,
  });

  // @ts-ignore
  const { modal, setModal } = useModal();


  useEffect(() => {
    setModal({...modal, project:name})  
  }, [name])
  
  return (
    <Layout>
      <LayoutHeader>
        {project?.name !== undefined && <Breadcrumd project={project} runName={run?.name} runs={runs}/>}
      </LayoutHeader>
      <div className="md:flex lg:flex xl:flex h-screen bg-white overflow-hidden">
          <div className="w-100 md:w-64 lg:w-64 xl:w-64 overflow-y-auto flex-shrink-0 overflow-x-hidden border-r">
            {errorState && <NavMenu errorState={errorState} />}
          </div>
          <div className="w-full h-full">
            <Content />
          </div>
      </div>
      <FormModal useModal={{ modal, setModal }} />
    </Layout>
  );
};

function RunWithProvider() {
  return (
    <FeatureProvider>
      <ErrorStateTestProvider>
        <ScrollProvider>
          <ModalProvider>
            <LayoutState />
          </ModalProvider>
        </ScrollProvider>
      </ErrorStateTestProvider>
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
