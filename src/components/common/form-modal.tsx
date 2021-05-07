import { Modal } from "./modal";

export function FormModal({useModal}) {
    // @ts-ignore
    const { modal, setModal } = useModal;
    
    const handleCloseModal = () => {
      setModal({...modal,modalOpen:false})
    }
    
    const { testName, run, project, description } = modal
    const handleChange = ({ target }) => {
      setModal({
        ...modal,
        [ target.name ]: target.value
      });
    }
    const handleSubmit = (e) => {
      // .trim()
      if (testName < 1 || run < 1 || project < 1 || description < 1) {
        alert('Completar los campos')
      } else {
        alert('Enviado');
        setModal({...modal,modalOpen:false})
      }
    }
    return (
      <>
        <Modal visible={modal?.modalOpen} onClose={() => {}}>
            <div className="bg-white w-5/12 m-auto rounded-lg shadow-2xl">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-11/12 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Form
                    </h3>
                    <div className="mt-3">
                      <input
                        className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        type="text"
                        name="project"
                        placeholder="Project"
                        value={project}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-3">
                      <input
                        className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Run"
                        name="run"
                        value={run}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-3">
                      <input
                        className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Test name"
                        name="testName"
                        value={testName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-3">
                      <textarea
                        className="h-20 text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  // onClick={handleCloseModal}
                  onClick={handleSubmit}
                  type="submit"
                  className="mr-6 bg-blue-500 text-white font-medium py-1 px-4 rounded transition duration-300 hover:bg-blue-600"
                  >
                  Send
                </button>
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="mr-2 text-sm text-dark border font-medium py-0.5 px-2 rounded transition duration-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
        </Modal>
      </>
    )
  }