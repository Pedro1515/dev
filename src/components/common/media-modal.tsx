import React, { Component } from "react";
import { getMedias } from "src/api";
import { Button } from "react-bootstrap";
import { Spinner } from "src/components/";
import { Modal } from "src/components";

interface IMedia {
  testId?: string;
}

export class MediaModal extends Component<IMedia> {
  state = {
    base64String: "",
    isOpen: false,
  };

  constructor(props) {
    super(props);
  }

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false });

  fetchMedia = async () => {
    getMedias(this.props.testId).then((res) => {
      this.setState({ base64String: `${res}` });
    });
  };

  render() {
    return (
      <>
        <div className="d-flex align-items-center justify-content-center">
          {
            <Button
              className="block w-full lg:inline-block lg:w-auto px-4 py-3 lg:py-2 bg-indigo-300 rounded-lg font-semibold text-sm text-gray-800 mt-4 lg:mt-0 lg:order-1"
              variant="primary"
              onClick={() => {
                this.openModal();

                if (this.state.base64String == "") {
                  this.fetchMedia();
                }
              }}
            >
              View Image
            </Button>
          }
        </div>

        <Modal visible={this.state.isOpen} onClose={() => {}}>
          <div className={`${this.state.base64String == "" ? "" : "h-screen"} text-center`}>
            <div
              className="ml-12 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:align-middle"
              style={{ height: "96%" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {this.state.base64String == "" ? (
                <div onClick={this.closeModal} className="flex-center flex-1">
                  <Spinner className="m-5 h-10 w-10 text-gray-500" />
                </div>
              ) : (
                <>
                  <div className="h-full">
                    <img
                      className="h-full"
                      src={this.state.base64String}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className="ml-2 inline-block align-bottom text-left overflow-hidden transform sm:align-middle"
              style={{ height: "96%" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {this.state.base64String == "" ? (
                <>
                </>
              ) : (
                <div onClick={this.closeModal} className="inline-block shadow-2xl bg-white mt-px py-1 px-2 rounded-md cursor-pointer transition duration-200 hover:bg-gray-100">
                  <span className="leading-none text-xl font-medium" aria-hidden="true">&times;</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
