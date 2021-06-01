import React from "react";
import axios from "axios";
import auth from "./Auth";
import { Spinner } from "react-bootstrap";

export const Context = React.createContext();

export class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: {
        files: {},
        column: {
          id: "column-1",
          fileIds: [],
        },
        columnOrder: ["column-1"],
      },
      familySetupData: {
        useFamilySetup: false,
        artworkFamily: null,
        familyDescription: null,
        location: null,
        year: null,
        seeAlso: [],
        themes: [],
        category: {},
        displayTriggers: {
          category: [],
          subcategory: [],
          listitems: [],
          themes: [],
          year: "",
          location: "",
        },
      },
      relatedArtwork: {},
      categoriesData: [],
      seeAlsoData: { renderFiles: { fileNames: [] } },
      themesData: [],
      artworkFamilyList: [],
      serverFileDir: [],
      showModal: false,
      modal: {
        showModal: false,
        modalMessage: null,
        onClose: () => this.toggleModal(),
        parentModal: false,
      },
      displayOrder: {
        general: []
      }
    };

    this.changeFileName = (e) => {
      let nameWithFileType = `${e.target.value.split(".")[0]}.${
        this.state.fileType.split("/")[1]
      }`;
      this.setState({
        fileName: nameWithFileType,
        filePath: `uploads/${nameWithFileType}`,
      });
    };
    this.setArtworkOnDisplay = (options) => {
      console.log("setartworkondisplay options")
      console.log(options)
      let newState = { ...this.state };
      newState.artworkOnDisplay = options.list;
      newState.displayOrder = options.order
      this.setState(newState);
    };
    this.onChange = (e, key, fileName) => {
      let target = null;
      let newState = { ...this.state };
      if (fileName) {
        target = newState.fileData.files[fileName];
      } else {
        target = newState.familySetupData;
      }

      if (!target[key]) {
        target[key] = [];
      }
      let inputValue = e.target.value ? e.target.value : e.target.textContent;
      if (key === "displayMain") {
        if (e.target.value === "yes") {
          inputValue = true;
        } else {
          inputValue = false;
        }
      }
      // target[key] = [...target[key], inputValue]
      target[key] = inputValue;
      this.setState(newState);
    };
    this.inputFamilyDescription = (value) => {
      let newState = { ...this.state };
      newState.familySetupData.familyDescription = value;
      this.setState(newState);
    };
    //adds new family name/theme
    this.addNew = (e, id, router, requestKey, stateKey, callback) => {
      e.preventDefault();

      return new Promise((resolve, reject) => {
        const newAddition = document.getElementById(id).value;
        if (!this.verify().verified) {
          let newState = { ...this.state };
          if (newState[stateKey].includes(newAddition)) {
            return reject();
          }
          newState[stateKey] = [...newState[stateKey], newAddition];
          this.setState(newState, resolve({ modalMessage: "State updated." }));
          return;
        }
        if (requestKey === "artworkFamily") {
          // promise =
          axios
            .post(router, { [requestKey]: newAddition })
            .then((res) => {
              if (callback) {
                callback("Successfully recored");
              }
              let newState = { ...this.state };
              newState.familySetupData.artworkFamily = newAddition;
              this.setState(newState, () => resolve());
            })
            .catch((err) => {
              console.log("error!!!");
              console.log(err.toJSON());
              if (callback) {
                callback(err.toString());
                // callback(err.toString())
              }
              reject(err);
            });
        } else {
          console.log(requestKey);
          // promise =
          axios
            .put(router, { [requestKey]: newAddition })
            .then((res) => {
              this.setState(
                { [stateKey]: [...this.state[stateKey], newAddition] },
                () => {
                  if (callback) {
                    callback(res.data);
                    resolve();
                  } else {
                    resolve();
                  }
                  //   let newState = {...this.state}
                  //   newState[stateKey] = [...newState[stateKey], newAddition]
                  //   this.setState(newState, () => resolve())
                }
              );
            })
            .catch((err) => {
              console.log("error!!!");
              console.log(err.toJSON());
              if (callback) {
                callback(`Theme ${newAddition} has already been recorded`);
              }
              reject();
            });
        }
      });
    };

    this.deleteTheme = (theme) => {
      return new Promise((resolve, reject) => {
        if (!this.verify().verified) {
          console.log("NOT verified");
          let newState = { ...this.state };
          newState.themesData = newState.themesData.filter(
            (oldtheme) => oldtheme !== theme
          );
          this.setState(newState, () =>
            resolve({ modalMessage: "State updated." })
          );
        } else {
          axios
            .put("/api/themes/delete", { list: theme })
            .then((res) => {
              console.log("themee deleted");
              let newState = { ...this.state };
              newState.themesData = newState.themesData.filter(
                (oldtheme) => oldtheme !== theme
              );
              console.log("newState.themesData");
              console.log(newState.themesData);
              this.setState(newState, () => {
                resolve();
              });
            })
            .catch((err) => reject());
        }
      });
    };

    //creates an array of all files in the server uploads folder
    /**
     * @returns
     */
    this.readImageDir = () => {
      return new Promise((resolve, reject) => {
        axios
          .get("/fetchImages")
          .then((res) => {
            resolve(res);
            // this.setState({serverFileDir: res.data})
          })
          .catch((err) => {
            console.log("readImageDir failed");
            console.log(err);
            reject(err);
          });
      });
    };

    //this takes care of CATEGORIES used for navigation
    this.categoryMethods = {
      getCategoryNames: () => {
        let categoryDomList = Object.keys(
          this.state.categoriesOptionList.data
        ).map((name) => {
          return (
            <option key={`add-category-${name}`} value={name}>
              {name}
            </option>
          );
        });

        let newState = { ...this.state };
        newState.categoriesOptionList.DOM = {};
        newState.categoriesOptionList.DOM.categories = categoryDomList;
        this.setState(newState);
      },
      getSubcategoryNames: () => {
        let newState = { ...this.state };

        if (!newState.categoriesOptionList.DOM) {
          newState.categoriesOptionList.DOM = {};
        }

        let subCategoryDomList = [];
        let optGroups = null;

        if (document.getElementById("add-category").value) {
          if (
            Object.keys(this.state.categoriesOptionList.data).includes(
              document.getElementById("add-category").value
            )
          ) {
            let selectedCategory = document.getElementById("add-category")
              .value;

            subCategoryDomList = this.state.categoriesOptionList.data[
              selectedCategory
            ].map((subcategory) => {
              return (
                <option
                  key={`add-subcategory-${subcategory}`}
                  value={subcategory}
                >
                  {subcategory}
                </option>
              );
            });
          }
        } else {
          optGroups = [];
          optGroups = Object.keys(this.state.categoriesOptionList.data).map(
            (cat) => {
              return (
                <optgroup key={cat} label={cat}>
                  {this.state.categoriesOptionList.data[cat].map((subCat) => {
                    return (
                      <option key={`add-subcategory-${subCat}`} value={subCat}>
                        {subCat}
                      </option>
                    );
                  })}
                </optgroup>
              );
            }
          );
        }
        newState.categoriesOptionList.DOM.subCategories = subCategoryDomList;
        if (optGroups) {
          newState.categoriesOptionList.DOM.subCategories = optGroups;
        }
        this.setState(newState);
      },
      submitNewCategory: () => {
        return new Promise((resolve, reject) => {
          const categoryInput = document.getElementById("add-category");
          const subcategoryInput = document.getElementById("add-subcategory");
          const listitemInput = document.getElementById("add-listitem");

          if (
            !categoryInput.value ||
            categoryInput.value === "" ||
            categoryInput.value === " "
          ) {
            reject({
              modalMessage: "Action failed. Cannot submit empty value.",
            });
          }

          let reqBody = { category: categoryInput.value, subcategory: {} };
          //IF THE VALUE DOES NOT EXIST IN THE CATEGORYNAMES ARRAY IE IS NEW
          if (subcategoryInput.value) {
            reqBody.subcategory = { [subcategoryInput.value]: [] };
          } else {
            reqBody.subcategory = {};
          }
          if (listitemInput.value) {
            reqBody.subcategory[subcategoryInput.value] = [listitemInput.value];
          } else {
            reqBody.subcategory[subcategoryInput.value] = [];
          }

          if (!this.verify({ customGuestMessage: true }).verified) {
            let newState = { ...this.state };
            newState.categoriesData.push(reqBody);
            return this.setState(
              newState,
              resolve({ modalMessage: "State updated" })
            );
          } else {
            axios
              .post("/api/categories/create", reqBody)
              .then((res) => {
                let newState = { ...this.state };
                newState.categoriesData = [
                  ...newState.categoriesData,
                  res.data,
                ];
                newState.categoriesOptionList.data = {
                  ...newState.categoriesOptionList.data,
                  [categoryInput.value]: [],
                };
                this.setState(
                  newState,
                  resolve({ modalMessage: "New category registered." })
                );
              })
              .catch((err) => {
                console.log(err);
                reject({ modalMessage: "Action failed." });
              });
          }
        });
      },
      updateCategory: () => {
        return new Promise((resolve, reject) => {
          const categoryInput = document.getElementById("add-category");
          const subcategoryInput = document.getElementById("add-subcategory");
          const listitemInput = document.getElementById("add-listitem");

          const allCats = Object.values(this.state.categoriesData).map(
            (obj) => obj.category
          );

          //check if the CATGORY input value is already recorded in the database
          //if it is run submitNewCategory method instead and exit this function
          if (!allCats.includes(categoryInput.value)) {
            this.categoryMethods
              .submitNewCategory()
              .then((res) =>
                resolve({ modalMessage: "New category registered." })
              )
              .catch((err) => reject({ modalMessage: "Action failed." }));
            return;
          }

          //if category name already exists
          let objToUpdate = this.state.categoriesData.find(
            (obj) => obj.category === categoryInput.value
          );
          let objIndex = this.state.categoriesData.indexOf(objToUpdate);

          let categoriesDataUpdate = { ...this.state.categoriesData };
          let subcategoryArray =
            categoriesDataUpdate[objIndex].subcategory[subcategoryInput.value];
          //if subcategory doesnt exist, initiate it
          if (!subcategoryArray) {
            subcategoryArray = [];
            categoriesDataUpdate[objIndex].subcategory[
              subcategoryInput.value
            ] = subcategoryArray;
          }
          //if new listitem has been entered
          if (listitemInput.value) {
            categoriesDataUpdate[objIndex].subcategory[
              subcategoryInput.value
            ] = [...subcategoryArray, listitemInput.value];
          }

          if (!this.verify({ customGuestMessage: true }).verified) {
            let newState = { ...this.state };
            newState.categoriesData[objIndex] = objToUpdate;
            return this.setState(
              newState,
              resolve({ modalMessage: "State updated." })
            );
          } else {
            axios
              .put("/api/categories/update", objToUpdate)
              .then((res) => {
                let newState = { ...this.state };
                newState.categoriesData[objIndex] = res.data;
                this.setState(
                  newState,
                  resolve({ modalMessage: "Database updated." })
                );
              })
              .catch((err) => reject({ modalMessage: "Action failed." }));
          }
        });
      },
      deleteCategory: (categoryName, updateContent, deletedItem) => {
        return new Promise((resolve, reject) => {
          if (!this.verify({ customGuestMessage: true }).verified) {
            let newState = { ...this.state };
            const deletetedCategoryIndex = newState.categoriesData.indexOf(
              deletedItem.category
            );

            //if category is deleted
            if (!updateContent) {
              newState.categoriesData = newState.categoriesData.filter(
                (obj) => obj.category !== deletedItem.category
              );
            }
            //if subcategory or listitem is deleted
            else {
              newState.categoriesData.splice(
                deletetedCategoryIndex,
                1,
                updateContent
              );
            }
            return this.setState(
              newState,
              resolve({ modalMessage: "State updated." })
            );
          } else {
            axios
              .put("/api/categories/delete", { categoryName, updateContent })
              .then((res) => {
                let newState = { ...this.state };
                const categoryObj = newState.categoriesData.find(
                  (category) => category.category === categoryName
                );
                const categoryIndex = newState.categoriesData.indexOf(
                  categoryObj
                );
                //delete category
                if (!deletedItem.subcategory) {
                  newState.categoriesData = newState.categoriesData.filter(
                    (category) => category.category !== categoryName
                  );
                  res.modalMessage = (
                    <span>
                      Category <strong>{deletedItem.category}</strong> deleted.
                    </span>
                  );
                }
                //delete listitem
                else if (deletedItem.listitem) {
                  let newArray =
                    newState.categoriesData[categoryIndex].subcategory[
                      deletedItem.subcategory
                    ];
                  newState.categoriesData[categoryIndex].subcategory[
                    deletedItem.subcategory
                  ] = newArray.filter(
                    (listItem) => listItem !== deletedItem.listitem
                  );
                  res.modalMessage = (
                    <span>
                      Listitem <strong>{deletedItem.listitem}</strong> deleted
                      from <strong>{deletedItem.subcategory}</strong>{" "}
                      subcategory in <strong>{deletedItem.category}</strong>{" "}
                      category.
                    </span>
                  );
                }
                //delete subcategory
                else if (deletedItem.subcategory && !deletedItem.listitem) {
                  delete newState.categoriesData[categoryIndex];
                  newState.categoriesData[categoryIndex] = res.data;
                  res.modalMessage = (
                    <span>
                      Subcategory <strong>{deletedItem.subcategory}</strong>{" "}
                      deleted from <strong>{deletedItem.category}</strong>{" "}
                      category.
                    </span>
                  );
                }
                this.setState(newState, () => {
                  resolve(res);
                });
              })
              .catch((err) => {
                err.modalMessage = "Action failed";
                reject(err);
              });
          }
        });
      },
      autoCheckCategories: (fileName, category, subcategory, listitem) => {
        let statePath = this.state.familySetupData.category;

        if (fileName) {
          statePath = this.state.fileData.files[fileName].category;
        }

        if (listitem) {
          if (!statePath) {
            return;
          }
          if (statePath[category]) {
            if (statePath[category][subcategory]) {
              if (statePath[category][subcategory].includes(listitem)) {
                return true;
              } else {
                return false;
              }
            }
            return false;
          }
          return false;
        }

        if (subcategory) {
          if (!statePath) {
            return;
          }
          if (statePath[category]) {
            if (statePath[category][subcategory]) {
              return true;
            } else {
              return false;
            }
          }
          return false;
        }

        if (category) {
          if (!statePath) {
            return;
          }
          if (statePath[category]) {
            return true;
          } else {
            return false;
          }
        }
      },
      onCheck: (e, fileName) => {
        let statePath = this.state.familySetupData;

        if (fileName) {
          statePath = this.state.fileData.files[fileName];
          if (!this.state.fileData.files[fileName].category) {
            this.state.fileData.files[fileName].category = {};
          }
        }

        const listItemPath = (
          category,
          subcategory,
          newListitems,
          fileName
        ) => {
          let newState = {};

          if (fileName) {
            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    category: {
                      ...this.state.fileData.files[fileName].category,
                      [category]: {
                        ...this.state.fileData.files[fileName].category[
                          category
                        ],
                        [subcategory]: newListitems,
                      },
                    },
                  },
                },
              },
            };
          } else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                category: {
                  ...this.state.familySetupData.category,
                  [category]: {
                    ...this.state.familySetupData.category[category],
                    [subcategory]: newListitems,
                  },
                },
              },
            };
          }
          return newState;
        };

        const categoryPath = (newCategory, fileName) => {
          let newState = {};

          if (fileName) {
            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    category: {
                      ...this.state.fileData.files[fileName].category,
                      [newCategory]: {},
                    },
                  },
                },
              },
            };
          } else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                category: {
                  ...this.state.familySetupData.category,
                  [newCategory]: {},
                },
              },
            };
          }
          return newState;
        };

        const subcategoryPath = (newCategory, newSubcategory, fileName) => {
          let newState = {};

          if (fileName) {
            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    category: {
                      ...this.state.fileData.files[fileName].category,
                      [newCategory]: {
                        ...this.state.fileData.files[fileName].category[
                          newCategory
                        ],
                        [newSubcategory]: [],
                      },
                    },
                  },
                },
              },
            };
          } else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                category: {
                  ...this.state.familySetupData.category,
                  [newCategory]: {
                    ...this.state.familySetupData.category[newCategory],
                    [newSubcategory]: [],
                  },
                },
              },
            };
          }
          return newState;
        };

        //this is handled if a checkbox is UNCHECKED
        if (!e.target.checked) {
          let classname = e.target.classList[1];
          let checkboxId = e.target.value;
          let subcategory = null;
          let category = null;
          let listItemNest = null;
          let newListitems = null;
          let stateCopy = { ...statePath };
          let newState = { ...this.state };
          let target = null;

          if (fileName) {
            target = newState.fileData.files[fileName].displayTriggers;
          } else {
            target = newState.familySetupData.displayTriggers;
          }

          if (classname === "listitem") {
            subcategory = e.target.parentNode.parentNode.id;
            category = e.target.parentNode.parentNode.parentNode.id;
            listItemNest = statePath.category[category][subcategory];
            newListitems = listItemNest.filter((item) => item !== checkboxId);

            newState = listItemPath(
              category,
              subcategory,
              newListitems,
              fileName
            );

            target[classname] = newListitems;
          } else if (classname === "subcategory") {
            category = e.target.parentNode.parentNode.parentNode.id;

            delete stateCopy.category[category][checkboxId];
            Array.from(
              document.getElementById(checkboxId).getElementsByTagName("input")
            ).forEach((item) => (item.checked = false));
            if (fileName) {
              newState = {
                fileData: {
                  ...this.state.fileData,
                  files: {
                    ...this.state.fileData.files,
                    [fileName]: {
                      ...this.state.fileData.files[fileName],
                      category: stateCopy.category,
                    },
                  },
                },
              };
            } else {
              newState = {
                familySetupData: {
                  ...this.state.familySetupData,
                  category: stateCopy.category,
                },
              };
            }

            const listitemsToRemove = this.state.categoriesData.filter(
              (obj) => obj.category === category
            )[0].subcategory[checkboxId];
            target.listitems = target.listitems.filter(
              (trigger) => !listitemsToRemove.includes(trigger)
            );
            target[classname] = target[classname].filter(
              (trigger) => trigger !== checkboxId
            );
          } else if (classname === "category") {
            category = e.target.parentNode.parentNode.id;
            delete stateCopy.category[category];
            Array.from(
              document.getElementById(category).getElementsByTagName("input")
            ).forEach((item) => (item.checked = false));
            if (fileName) {
              newState = {
                fileData: {
                  ...this.state.fileData,
                  files: {
                    ...this.state.fileData.files,
                    [fileName]: {
                      ...this.state.fileData.files[fileName],
                      category: stateCopy.category,
                    },
                  },
                },
              };
            } else {
              newState = {
                familySetupData: {
                  ...this.state.familySetupData,
                  category: stateCopy.category,
                },
              };
            }

            let subcategoriesValues = Object.values(
              this.state.categoriesData.filter(
                (obj) => obj.category === category
              )[0].subcategory
            );

            let listitemsToRemove = subcategoriesValues.flat();

            target.listitems = target.listitems.filter(
              (trigger) => !listitemsToRemove.includes(trigger)
            );
            target[classname] = target[classname].filter(
              (trigger) => trigger !== category
            );
            target.subcategory = target.subcategory.filter(
              (trigger) =>
                !this.state.categoriesOptionList.data[category].includes(
                  trigger
                )
            );
          }
          this.setState(newState);
          return;
        }

        //This creates checkbox trees and and values to it
        const parentCheckbox = (target) => {
          return Array.from(target.getElementsByTagName("input"))[0];
        };
        const classNameCheck = (name) => {
          if (name === "list--listitem") {
            return e.target.parentNode.classList.contains(name);
          }
          return e.target.parentNode.parentNode.classList.contains(name);
        };

        let category = parentCheckbox(
          e.target.parentNode.parentNode.parentNode
        );
        let subcategory = parentCheckbox(e.target.parentNode.parentNode);

        switch (true) {
          case classNameCheck("list--category"):
            this.setState(categoryPath(category.value, fileName));
            break;

          case classNameCheck("list--listitem"):
            category = parentCheckbox(
              e.target.parentNode.parentNode.parentNode
            );
            subcategory = parentCheckbox(e.target.parentNode.parentNode);

            const newListItem = e.target.value;
            let newList = [newListItem];

            if (statePath.category) {
              if (statePath.category[category.value]) {
                if (statePath.category[category.value][subcategory.value]) {
                  if (
                    statePath.category[category.value][subcategory.value]
                      .length > 0
                  ) {
                    newList = [
                      ...statePath.category[category.value][subcategory.value],
                      newListItem,
                    ];
                  }
                }
              }
            }
            this.setState(
              listItemPath(category.value, subcategory.value, newList, fileName)
            );
            break;

          case classNameCheck("list--subcategory"):
            this.setState(
              subcategoryPath(category.value, subcategory.value, fileName)
            );
            break;
          default:
            return;
        }
      },
      displayCategory: (displayTrigger, value) => {
        // categoriesOnDisplay
        return new Promise((resolve, reject) => {
          console.log(`displayTrigger ${displayTrigger}`)
          console.log(`value ${value}`)
          let newState = {...this.state}
          let categoriesOnDisplay = {...this.state.categoriesOnDisplay}
          //IF CHECKED
          const newObj = (name, altName, display) => {
            return {altName: altName, name: name, display: display}
          }
  
          if(!categoriesOnDisplay[displayTrigger][value]){
            categoriesOnDisplay[displayTrigger][value] = newObj(value, null, null)
          }
          const altName = categoriesOnDisplay[displayTrigger][value].altName
          
          if(categoriesOnDisplay[displayTrigger][value].display){
            categoriesOnDisplay[displayTrigger] = {...categoriesOnDisplay[displayTrigger], [value]:newObj(value, altName, null)}
          }
          else{
            categoriesOnDisplay[displayTrigger] = {...categoriesOnDisplay[displayTrigger], [value]:newObj(value, altName, true)}
          }
          newState.categoriesOnDisplay = {...categoriesOnDisplay}
          this.setState(newState, () => resolve())
        })
      },
    displayCategoryAltName: (displayTrigger, parent, value) => {

      const checkParent = () => {
        return new Promise((resolve, reject) => {
          if(!this.state.categoriesOnDisplay[displayTrigger][parent]){
            this.categoryMethods.displayCategory(displayTrigger, parent)
              .then(res => resolve())
          }
          else{resolve()}
        }) 
      }
      checkParent()
        .then(res => {
          let altName = {...this.state.categoriesOnDisplay[displayTrigger][parent].altName}
          altName = value
          let newState = {...this.state}
          newState.categoriesOnDisplay[displayTrigger][parent].altName = altName
          this.setState(newState)
        })
    }
    };
    //this deal with file input uploads and uploads to server
    this.fileDataMethods = {
      deleteImage: (fileName) => {
        axios.delete(`/deleteImage`, fileName)
        .then((res) => {
          alert(res);
        });
      },
      deleteDBrecord: (fileName, artworkFamily, cb) => {
        return new Promise((resolve, rej) => {
          const paths = {
            mobilePath: `file.mobilePath`,
            thumbnailPath: `file.thumbnailPath`,
            desktopPath: `file.desktopPath`,
          };

          let newState = { ...this.state };

          const unlinkSeeAlso = () => {
            return new Promise((resolve, reject) => {
              const allFiles = { ...this.state.artworkInfoData };
              const fileToDelete = allFiles[fileName];
              const progressLength = fileToDelete.seeAlso.length;
              let progress = 0;
              if (!progressLength > 0) {
                resolve();
              }

              fileToDelete.seeAlso.forEach((fileToUnlink) => {
                if (!newState.artworkInfoData[fileToUnlink]) {
                  console.log(
                    `${fileToUnlink} not found. Check ${fileName} "seeAlso" record in the database`
                  );
                  return;
                }
                newState.artworkInfoData[
                  fileToUnlink
                ].seeAlso = newState.artworkInfoData[
                  fileToUnlink
                ].seeAlso.filter(
                  (fileName) => fileName !== fileToDelete.fileName
                );

                this.fileDataMethods
                  .updateArtworkInfo(newState.artworkInfoData[fileToUnlink])
                  .then((res) => {
                    progress++;
                    if (progress === progressLength) {
                      resolve();
                    }
                  })
                  .catch((rej) => {
                    console.log("ERROR");
                    reject();
                  });
              });
            });
          };

          unlinkSeeAlso().then((res) => {
            //delete from mongo
            axios
              .delete(`/api/artworkInfo/delete/${fileName}`)
              .then((res) => {
                //delete image files from server
                axios
                  .delete(`/deleteImage/delete/${fileName}`, paths)
                  //remove from state
                  .then((res) => {
                    let relatedArtwork = { ...this.state.relatedArtwork };
                    delete relatedArtwork[artworkFamily].files[fileName];
                    const fileIds =
                      relatedArtwork[artworkFamily].column.fileIds;
                    let newFileIds = fileIds.filter(
                      (name) => name !== fileName
                    );
                    relatedArtwork[artworkFamily].column.fileIds = newFileIds;
                    let artworkOnDisplay = { ...this.state.artworkOnDisplay };
                    delete artworkOnDisplay[fileName];
                    let artworkInfoData = newState.artworkInfoData;
                    delete artworkInfoData[fileName];
                    this.setState(
                      { relatedArtwork, artworkInfoData, artworkOnDisplay },
                      () => {
                        res.modalMessage = "File and its DB record deleted";
                        resolve(res);
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));
          });
        }).catch((rej) => console.log("ERROR"));
      },
      serverFileToState: (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            reject("file record not found");
          }
          let newState = { ...this.state };
          newState.fileData.files = {
            ...newState.fileData.files,
            [file.fileName]: file,
          };
          if (!file.displayTriggers) {
            newState.fileData.files[file.fileName].displayTriggers = {
              category: [],
              subcategory: [],
              listitems: [],
              themes: [],
              year: "",
              location: "",
            };
          }
          this.setState(newState, () => {
            resolve("file transferred");
          });
        });
      },
      /**
       * @param value the value to be added to state
       * @param string the name of the family nest where the new value will be added
       * @param fileName optional: decided which file to update with new value
       * @returns updated context state
       */
      onChange: (value, string, fileName, cb) => {

        let newState = { ...this.state };

        if (string === "themes") {
          let newList = [];
          if (!newState.fileData.files[fileName][string]) {
            newState.fileData.files[fileName][string] = [];
          }
          if (!newState.fileData.files[fileName].displayTriggers[string]) {
            newState.fileData.files[fileName].displayTriggers[string] = [];
          }
          if (this.state.fileData.files[fileName][string].includes(value)) {
            newList = this.state.fileData.files[fileName][string].filter(
              (item) => item !== value
            );
          } else {
            newList = [...this.state.fileData.files[fileName][string], value];
          }
          // let newState = []

          newState = {
            ...this.state,
            fileData: {
              ...this.state.fileData,
              files: {
                ...this.state.fileData.files,
                [fileName]: {
                  ...this.state.fileData.files[fileName],
                  [string]: newList,

                  displayTriggers: {
                    ...this.state.fileData.files[fileName].displayTriggers,
                    [string]: newList,
                  },
                },
              },
            },
          };

          this.setState(newState, () => {
            if (cb) {
              cb();
            }
          });
          return;
        } else if (string !== "year" && string !== "location") {
          if (!newState.fileData.files[fileName].displayTriggers[string]) {
            newState.fileData.files[fileName].displayTriggers[string] = [];
          }
          if (
            this.state.fileData.files[fileName].displayTriggers[
              string
            ].includes(value)
          ) {
            // let newState = []
            let newList = this.state.fileData.files[fileName].displayTriggers[
              string
            ].filter((item) => item !== value);

            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    displayTriggers: {
                      ...this.state.fileData.files[fileName].displayTriggers,
                      [string]: newList,
                    },
                  },
                },
              },
            };
            this.setState(newState, () => {
              if (cb) {
                cb();
              }
            });
            return;
          }
        } else {
          newState = {
            ...this.state,
            fileData: {
              ...this.state.fileData,
              files: {
                ...this.state.fileData.files,
                [fileName]: {
                  ...this.state.fileData.files[fileName],
                  [string]: value,
                  displayTriggers: {
                    ...this.state.fileData.files[fileName].displayTriggers,
                    [string]: value,
                  },
                },
              },
            },
          };
        }

        this.setState(newState);
      },
      onChangeDisplayTriggers: (value, string, fileName, familySetup, cb) => {
        let nestType = () => {
          if (string !== "year" && string !== "location") {
            return "themes";
          } else {
            return "string";
          }
        };

        let nestTypeResult = nestType();

        let newState = { ...this.state };
        let target = null;
        let nest = null;
        if (!familySetup) {
          target = newState.fileData.files[fileName];
        } else {
          target = newState.familySetupData;
        }
        if (!target.displayTriggers) {
          target.displayTriggers = {
            category: [],
            subcategory: [],
            listitems: [],
            themes: [],
            year: "",
            location: "",
          };
        }
        nest = target.displayTriggers;
        if (nestTypeResult === "themes") {
          let newList = [];
          if (!nest[string]) {
            nest[string] = [];
          }
          if (nest[string].includes(value)) {
            newList = nest[string].filter((item) => item !== value);
          } else {
            newList = [...nest[string], value];
          }

          if (!familySetup) {
            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    displayTriggers: {
                      ...this.state.fileData.files[fileName].displayTriggers,
                      [string]: newList,
                    },
                  },
                },
              },
            };
          } else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                displayTriggers: {
                  ...this.state.familySetupData.displayTriggers,
                  [string]: newList,
                },
              },
            };
          }

          this.setState(newState, () => {
            if (cb) {
              cb();
            }
          });
          return;
        }
        //if category, subcategory or listitems
        else if (string !== "year" && string !== "location") {
          if (!nest[string]) {
            nest[string] = [];
          }
          if (this.nest[string].includes(value)) {
            // let newState = []
            let newList = nest[string].filter((item) => item !== value);

            if (!familySetup) {
              newState = {
                ...this.state,
                fileData: {
                  ...this.state.fileData,
                  files: {
                    ...this.state.fileData.files,
                    [fileName]: {
                      ...this.state.fileData.files[fileName],
                      displayTriggers: {
                        ...this.state.fileData.files[fileName].displayTriggers,
                        [string]: newList,
                      },
                    },
                  },
                },
              };
            } else {
              newState = {
                ...this.state,
                familySetupData: {
                  ...this.state.familySetupData,
                  displayTriggers: {
                    ...this.state.familySetupData.displayTriggers,
                    [string]: newList,
                  },
                },
              };
            }
            this.setState(newState, () => {
              if (cb) {
                cb();
              }
            });
            return;
          }
        }
        //if year or location
        else {
          if (nest[string] === value) {
            value = "";
          }
          if (!familySetup) {
            newState = {
              ...this.state,
              fileData: {
                ...this.state.fileData,
                files: {
                  ...this.state.fileData.files,
                  [fileName]: {
                    ...this.state.fileData.files[fileName],
                    // [string]: value,
                    displayTriggers: {
                      ...this.state.fileData.files[fileName].displayTriggers,
                      [string]: value,
                    },
                  },
                },
              },
            };
          } else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                displayTriggers: {
                  ...this.state.familySetupData.displayTriggers,
                  [string]: value,
                },
              },
            };
          }
        }
        this.setState(newState);
      },
      transferState: (file, radioValue, options) => {
        let newState = { ...this.state };

        //on check
        if (radioValue === true) {
          this.setState({ showModal: true });

          //overwrite file data witch each familySetUp property
          Object.keys(this.state.familySetupData).forEach((property) => {
            newState = {
              ...newState,
              fileData: {
                ...newState.fileData,
                files: {
                  ...newState.fileData.files,
                  [file.fileName]: {
                    ...newState.fileData.files[file.fileName],
                    [property]: this.state.familySetupData[property],
                  },
                },
              },
            };
          });
          let newDisplayTriggers = {};
          newDisplayTriggers.category = Object.keys(
            this.state.familySetupData.category
          );

          const getSubcategories = () => {
            let categories = Object.keys(this.state.familySetupData.category);
            let subcategories = [];
            categories.forEach((category) => {
              subcategories = [
                ...subcategories,
                ...Object.keys(this.state.familySetupData.category[category]),
              ];
            });
            return subcategories;
          };
          newDisplayTriggers.subcategory = getSubcategories();

          const getListitems = () => {
            const categories = Object.keys(this.state.familySetupData.category);
            let listItems = [];
            categories.forEach((category) => {
              let subcategories = Object.keys(
                this.state.familySetupData.category[category]
              );
              subcategories.forEach((sub) => {
                if (
                  !this.state.familySetupData.category[category][sub].length > 0
                ) {
                  return;
                }
                listItems = [
                  ...listItems,
                  ...this.state.familySetupData.category[category][sub],
                ];
              });
            });
            return listItems;
          };
          newDisplayTriggers.listitems = getListitems();

          newDisplayTriggers.themes = this.state.familySetupData.themes;

          newDisplayTriggers.year = this.state.familySetupData.year;
          newDisplayTriggers.location = this.state.familySetupData.location;

          newState.fileData.files[
            file.fileName
          ].displayTriggers = newDisplayTriggers;

          const relatedArtworkPromise = this.familySetupMethods.getRelatedArtwork(
            newState.fileData.files[file.fileName].artworkFamily,
            newState
          );

          relatedArtworkPromise.then((res) => {
            newState.relatedArtwork = {
              ...newState.relatedArtwork,
              [newState.fileData.files[file.fileName].artworkFamily]: res,
            };
            newState.fileData.files[file.fileName].relatedArtwork = res;
            newState.fileData.files[file.fileName].useFamilySetup = true;
            delete newState.fileData.files[file.fileName]._id;
            delete newState.fileData.files[file.fileName].__v;
            this.setState(newState, this.setState({ showModal: false }));
          });
        } else {
          axios
            .get(`/api/familySetup/none`)
            .then((res) => {
              let newFamInfo = res.data;
              delete newFamInfo.__v;
              delete newFamInfo._id;

              const currentInfo = this.state.fileData.files[file.fileName];
              let newFileInfo = { ...currentInfo };

              Object.keys(newFamInfo).forEach((propertyName) => {
                newFileInfo[propertyName] = newFamInfo[propertyName];
              });
              newFileInfo.useFamilySetup = false;

              newState.fileData.files[file.fileName] = newFileInfo;
              this.setState(newState);
            })
            .catch((err) => {
              console.log(err);
            });

          this.setState(newState);
        }
      },
      isChecked: (string, value, fileName) => {
        if (this.state.fileData.files[fileName][string].includes(value)) {
          return true;
        } else return false;
      },
      //This iss triggered upon upload files using file upload input
      addFileToState: (e) => {
        return new Promise((resolve, reject) => {
          const fileInput = e.target.files;
          const fileCount = fileInput.length;

          let modalState = { ...this.state };
          modalState.modal.showModal = true;
          modalState.modal.parentModal = true;
          modalState.modal.blockClose = true;
          let messageText =
            fileCount > 1 ? "Fetching files..." : "Fetching file...";
          modalState.modal.modalMessage = this.loadingMessage(messageText);
          this.setState(modalState);

          let obj = {
            files: {},
            column: {
              id: "column-1",
              fileIds: [],
            },
            columnOrder: ["column-1"],
          };
          let newState = { ...this.state };
          let objCounter = 0;

          let objPromise = new Promise((resolve, reject) => {
            let messages = {};

            const fileList = Array.from(fileInput);
            let filteredList = [];
            //fail cases
            fileList.forEach((file) => {
              if (this.state.fileData.column.fileIds.includes(file.name)) {
                messages = {
                  ...messages,
                  [file.name]: {
                    message: `Fail (already selected)`,
                    type: "fail",
                  },
                };
              } else if (this.state.serverFileDir.includes(file.name)) {
                messages = {
                  ...messages,
                  [file.name]: {
                    message: `Fail (already uploaded)`,
                    type: "fail",
                  },
                };
              } else if (file.name.includes(" ") || file.name.includes("/")) {
                messages = {
                  ...messages,
                  [file.name]: {
                    message: "Fail (File name cannot contain spaces or '/')",
                    type: "fail",
                  },
                };
              } else if (file.type.match("application/pdf")) {
                console.log("error");
                messages = {
                  ...messages,
                  [file.name]: {
                    message: "Fail (PDF not supported yet)",
                    type: "fail",
                  },
                };
              } else if (file.type.indexOf("image")) {
                console.log("error");
                messages = {
                  ...messages,
                  [file.name]: {
                    message: "Fail (only image files are supported)",
                    type: "fail",
                  },
                };
              } else {
                filteredList = [...filteredList, file];
              }
            });

            if (!filteredList.length > 0) {
              let modalMessages = Object.keys(messages).map((fileName) => {
                return (
                  <div
                    key={`fileUpload-${fileName}`}
                    className={"fileUploadMessage"}
                  >
                    <span>{fileName}: </span>{" "}
                    <span className={"fail"}>{messages[fileName].message}</span>
                  </div>
                );
              });
              document.getElementById("uploadFileInput").value = "";
              modalState = { ...this.state };
              modalState.modal.blockClose = false;
              modalState.modal.modalMessage = modalMessages;
              this.setState(modalState, () => resolve());
            }

            filteredList.forEach((file, index) => {
              const reader = new FileReader();
              reader.onload = () => {
                var image = new Image();

                image.src = reader.result;

                image.onload = () => {
                  let naturalSize = {
                    naturalHeight: image.naturalHeight,
                    naturalWidth: image.naturalWidth,
                  };

                  modalState = { ...this.state };
                  modalState.modal.blockClose = false;
                  modalState.modal.modalMessage = this.loadingMessage(
                    `Parsing ${file.name}`
                  );
                  this.setState(modalState, () => {
                    obj.files[file.name] = {
                      preview: reader.result,
                      file: fileInput[index],
                      fileName: file.name,
                      fileType: file.type,
                      familyDisplayIndex: null,
                      src: `uploads/${file.name}`,
                      themes: [],
                      seeAlso: [],
                      category: { studio: { misc: [] } },
                      displayTriggers: {
                        category: [],
                        subcategory: [],
                        listitems: [],
                      },
                      artworkFamily: "none",
                      naturalSize,
                    };

                    newState = {
                      ...this.state,
                      fileData: {
                        ...this.state.fileData,
                        files: {
                          ...newState.fileData.files,
                          [file.name]: obj.files[file.name],
                        },
                        column: {
                          ...newState.fileData.column,
                          fileIds: [
                            ...newState.fileData.column.fileIds,
                            file.name,
                          ],
                        },
                      },
                      relatedArtwork: {
                        ...this.state.relatedArtwork,
                        none: {
                          ...this.state.relatedArtwork.none,
                          files: {
                            ...newState.relatedArtwork.none.files,
                            [file.name]: obj.files[file.name],
                          },
                          column: {
                            ...newState.relatedArtwork.none.column,
                            fileIds: [
                              ...newState.relatedArtwork.none.column.fileIds,
                              file.name,
                            ],
                          },
                        },
                      },
                    };

                    newState.artworkInfoData = {
                      ...newState.artworkInfoData,
                      [file.name]: obj.files[file.name],
                    };
                    messages = {
                      ...messages,
                      [file.name]: { message: "Success", type: "success" },
                    };
                    objCounter += 1;
                    console.log("objCounter");
                    console.log(objCounter);
                    if (objCounter === filteredList.length) {
                      console.log("objCounter === fileCount");
                      let modalMessages = Object.keys(messages).map(
                        (fileName) => {
                          return (
                            <div
                              key={`fileUpload-${fileName}`}
                              className={"fileUploadMessage"}
                            >
                              <span>{fileName}: </span>
                              <span className={`${messages[fileName].type}`}>
                                {messages[fileName].message}
                              </span>
                            </div>
                          );
                        }
                      );
                      modalState = { ...this.state };
                      modalState.modal.blockClose = false;
                      modalState.modal.modalMessage = modalMessages;
                      this.setState(modalState, () => resolve());
                      // resolve(messages)
                    }
                  });
                };
              };

              reader.readAsDataURL(file);
            });
          });

          objPromise
            .then((res) => {
              this.setState(newState, () => resolve(res));
            })
            .catch((err) => reject(err));
        });
      },
      //THIS UPLOADS FILE TO SERVER
      uploadFile: (fileName) => {
        return new Promise((resolve, reject) => {
          const fileData = this.state.fileData.files;

          let modalState = { ...this.state };
          modalState.modal.showModal = true;
          modalState.modal.parentModal = true;
          modalState.modal.blockClose = true;
          modalState.modal.modalMessage = this.loadingMessage(
            `Uploading ${fileName} to server`
          );
          this.setState(modalState);
          const fd = new FormData();
          fd.append(
            "artworkImage",
            fileData[fileName].file,
            fileData[fileName].artwrokTitle || fileData[fileName].fileName
          );
          axios
            .post("/api/artworkInfo/imageUpload", fd)
            .then((res) => {
              console.log("og image uploaded");
              axios
                .post(`/resize/${fileName}`)
                .then((res) => {
                  this.readImageDir()
                    .then((res) => {
                      console.log("read image dir res");
                      console.log(res);
                      // popImage.then(res => resolve())

                      modalState.modal.blockClose = false;
                      modalState.modal.modalMessage = "Image Uploaded";
                      this.setState(modalState, () => resolve());

                      // resolve()
                    })
                    .catch((err) => {
                      console.log("readImageDir FAILED");
                      console.log(err);
                      reject();
                    });
                })
                .catch((err) => {
                  console.log("resize");
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err) => {
              console.log("/api/artworkInfo/imageUpload");
              console.log(err);
              reject(err);
            });
        });
      },
      //Removes selected file from state and thus DOM
      removeFile: (fileName, familyName) => {
        if (document.getElementById("uploadFileInput")) {
          document.getElementById("uploadFileInput").value = "";
        }

        let newFiles = { ...this.state.fileData.files };

        delete newFiles[fileName];

        let newState = {
          ...this.state,
          fileData: {
            ...this.state.fileData,
            column: {
              ...this.state.fileData.column,
              fileIds: this.state.fileData.column.fileIds.filter(
                (file) => file !== fileName
              ),
            },
            files: newFiles,
          },
        };

        if (familyName) {
          delete newState.relatedArtwork[familyName].files[fileName];
          newState.relatedArtwork[
            familyName
          ].column.fileIds = newState.relatedArtwork[
            familyName
          ].column.fileIds.filter((file) => file !== fileName);
        }
        this.setState(newState);
      },
      //change display index by dragging file preview
      onDragEnd: (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
          return;
        }

        const column = this.state.fileData.column[source.droppableId];

        let newFileIds = this.state.fileData.column.fileIds;

        newFileIds.splice(source.index, 1);
        newFileIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...column,
          fileIds: newFileIds,
        };

        let newState = { ...this.state };

        newState.fileData.column[newColumn.id] = newColumn;

        // newState = this.fileDataMethods.getFamilyDisplayIndex(newColumn.fileIds, newState)

        this.setState(newState);
      },
      onDragEndFamilyList: (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
          return;
        }

        const fileName = result.destination.droppableId;
        const artworkFamily = fileName.slice(
          0,
          fileName.match("-relatedArtworks").index
        );

        const column = this.state.relatedArtwork[artworkFamily].column[
          source.droppableId
        ];

        let newFileIds = this.state.relatedArtwork[artworkFamily].column
          .fileIds;
        // const column = this.state.fileData.files[fileName].relatedArtwork.column[source.droppableId];

        // let newFileIds = this.state.fileData.files[fileName].relatedArtwork.column.fileIds

        newFileIds.splice(source.index, 1);
        newFileIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...column,
          fileIds: newFileIds,
        };

        let newState = { ...this.state };

        newState.relatedArtwork[artworkFamily].column[newColumn.id] = newColumn;

        this.setState(newState);
      },
      updateArtworkInfo: (file) => {
        return new Promise((resolve, reject) => {
          if (!file.category || !Object.keys(file.category).length > 0) {
            reject(`To submit, select categories for file ${file.fileName}`);
          } else {
            if (file.artworkFamily) {
              const artworkFamily = file.artworkFamily;
              //check if display index has changed
              const currentFamilyDisplayIndex = this.state.relatedArtwork[
                artworkFamily
              ].column.fileIds.indexOf(file.fileName);
              const ogData = axios.get(
                `/api/artworkInfo/fileName/${file.fileName}`
              );
              ogData.then((res) => {
                console.log("res.data.familyDisplayIndex");
                console.log(res.data);
                console.log(res.data[0].familyDisplayIndex);
                if (
                  res.data[0].familyDisplayIndex === currentFamilyDisplayIndex
                ) {
                  console.log("fam index not changed");
                  const fileData = file;
                  // const fileData = this.state.fileData.files[file.fileName]
                  this.fileDataMethods
                    .relateSeeAlso(file)
                    .then((res) => {
                      axios
                        .put(
                          `/api/artworkInfo/update/${file.fileName}`,
                          fileData
                        )
                        .then((res) => {
                          resolve("file updated");
                        })
                        .catch((rej) => {
                          console.log("Record update failed");
                          console.log(rej);
                          reject("Record update failed");
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      reject();
                    });
                }
                //his will update each file in the family with new index
                else {
                  this.fileDataMethods
                    .relateSeeAlso(file)
                    .then((res) => {
                      const updateLength = Object.keys(
                        this.state.relatedArtwork[artworkFamily].files
                      ).length;
                      let progressCount = 0;
                      Object.keys(
                        this.state.relatedArtwork[artworkFamily].files
                      ).forEach((objName) => {
                        let obj = this.state.artworkInfoData[objName];
                        if (objName === file.fileName) {
                          obj = this.state.fileData.files[file.fileName];
                        }
                        const familyIndex = this.state.relatedArtwork[
                          artworkFamily
                        ].column.fileIds.indexOf(obj.fileName);
                        let fileData = obj;
                        fileData.familyDisplayIndex = familyIndex;
                        axios
                          .put(
                            `/api/artworkInfo/update/${obj.fileName}`,
                            fileData
                          )
                          .then((res) => {
                            progressCount += 1;
                            console.log(progressCount);
                            if (progressCount === updateLength) {
                              resolve("file updated");
                            }
                          })
                          .catch((rej) => {
                            console.log("Record update failed");
                            console.log(rej);
                            reject("Record update failed");
                          });
                      });
                    })
                    .catch((err) => {
                      console.log("relate see also error");
                      console.log(err);
                      reject();
                    });
                }
              });
            }
          }
        });
      },
      updateArtworkByFamily: (familyName) => {
        return new Promise((resolve, reject) => {
          const fileNamesInFamily = Object.keys(
            this.state.relatedArtwork[familyName].files
          );
          const updateLength = fileNamesInFamily.length;
          let progress = 0;
          if (updateLength > 0) {
            this.state.relatedArtwork[familyName].column.fileIds.forEach(
              (fileName, index) => {
                const familyDisplayIndex = this.state.relatedArtwork[
                  familyName
                ].column.fileIds.indexOf(fileName);
                const familyData = this.state.familySetupData;
                const {
                  category,
                  themes,
                  seeAlso,
                  familyDescription,
                  year,
                  location,
                } = familyData;
                let fileData = this.state.relatedArtwork[familyName].files[
                  fileName
                ];
                delete fileData.__v;
                delete fileData._id;
                delete fileData.relatedArtwork;
                fileData = {
                  ...fileData,
                  familyDisplayIndex,
                  category,
                  themes,
                  seeAlso,
                  familyDescription,
                  year,
                  location,
                };
                console.log("fileData");
                console.log(fileData);
                axios
                  .put(`/api/artworkInfo/update/${fileName}`, fileData)
                  .then((res) => {
                    progress += 1;
                    console.log(`progress: ${progress}/${updateLength}`);
                    if (progress === updateLength) {
                      resolve();
                    }
                  })
                  .catch((rej) => {
                    console.log("error");
                    console.log(rej);
                    reject(rej);
                  });
              }
            );
          } else {
            resolve();
          }
        });
      },
      postArtworkInfo: (file) => {
        console.log("post artwork info RUNS with");
        console.log(file);
        this.showModal("Uploading file");
        return new Promise((resolve, reject) => {
          if (this.state.serverFileDir.includes(file.fileName)) {
            this.showModal(
              'A file with the same name has been registered before. To update it, select "EDIT" tab'
            );
            reject();
          }

          if (!file.category || !Object.keys(file.category).length > 0) {
            this.showModal("To submit, select categories for this file");
            reject();
          }

          const artworkFamily = file.artworkFamily || "none";

          const familyIndex = this.state.relatedArtwork[
            artworkFamily
          ].column.fileIds.indexOf(file.fileName);
          let fileData = null;

          if (this.state.serverFileDir.includes(file.fileName)) {
            this.showModal(
              `file ${file.fileName} already exists on the server. Choose a different name, file, or edit records`
            );
            reject();
          } else {
            console.log("all good");
            fileData = this.state.fileData.files[file.fileName];

            const newName = fileData.fileName.slice(
              0,
              fileData.fileName.indexOf(".")
            );
            const fileExtension = fileData.fileName.slice(
              fileData.fileName.indexOf("."),
              fileData.fileName.length
            );

            let fileDataObject = {
              category: fileData.category ? fileData.category : null,
              displayTriggers: fileData.displayTriggers,
              filePath: `uploads/${fileData.fileName}`,
              thumbnailPath: `uploads/thumbnails/${newName}-thumbnail${fileExtension}`,
              mobilePath: `uploads/mobile/${newName}-mob${fileExtension}`,
              desktopPath: `uploads/desktop/${newName}-desktop${fileExtension}`,
              fileName: fileData.fileName,
              fileType: fileData.fileType,
              artworkFamily: artworkFamily ? artworkFamily : null,
              familyDescription: fileData.familyDescription
                ? fileData.familyDescription
                : null,
              artworkTitle: fileData.artworkTitle
                ? fileData.artworkTitle
                : null,
              artworkDescription: fileData.artworkDescription
                ? fileData.artworkDescription
                : null,
              themes: fileData.themes ? fileData.themes : null,
              seeAlso: fileData.seeAlso ? fileData.seeAlso : null,
              location: fileData.location ? fileData.location : null,
              year: fileData.year ? fileData.year : null,
              naturalSize: fileData.naturalSize,
              displayMain: fileData.displayMain ? fileData.displayMain : null,
            };

            fileDataObject.familyDisplayIndex = familyIndex;

            // this.fileDataMethods.relateSeeAlso(file)
            // .then(res => {
            //     console.log("relateSeeAlso successed")
            //     this.fileDataMethods.uploadFile(file.fileName)
            //     .then(res => {
            //         console.log("File uplaoded")
            //         axios.post('/api/artworkInfo/create', fileDataObject)
            //         .then( res => {
            //                 console.log("file record created")
            //                 this.showModal("File record created")
            //                 resolve()
            //             })
            //         .catch(err => {
            //             console.log(err);
            //             console.log("artworkInfo/create fail")
            //             this.showModal("artworkInfo/create fail")
            //             reject("error")
            //         })
            //     })
            //     .catch(err => {
            //         console.log("FILE UPLOAD FAIL")
            //         console.log(err);
            //         reject("error")
            //     })
            // })
            // .catch(err => {
            //     console.log("relateSeeAlso singleFileUpload error")
            //     console.log(err)
            //     this.showModal("relateSeeAlso singleFileUpload error")
            //     reject(err)
            // })
            this.fileDataMethods
              .relateSeeAlso(file)
              .then((res) => {
                console.log("run artworkInfo/create");
                axios
                  .post("/api/artworkInfo/create", fileDataObject)
                  .then((res) => {
                    this.fileDataMethods
                      .uploadFile(file.fileName)
                      .then((res) => {
                        // let newState = {...this.state}
                        // delete newState.fileData.files[file.fileName]
                        console.log("file uplaoded");
                        resolve("file uploaded");
                      })
                      .catch((err) => {
                        console.log(err);
                        reject("error");
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("artworkInfo/create fail");
                    this.showModal("artworkInfo/create fail");
                    reject("error");
                  });
              })
              .catch((err) => {
                console.log("relateSeeAlso singleFileUpload error");
                console.log(err);
                this.showModal("relateSeeAlso singleFileUpload error");
                reject(err);
              });
          }
        });
      },
      initialIndex: () => {
        let newState = { ...this.state };
        this.state.fileData.column.fileIds.forEach((fileName, index) => {
          newState.fileData.files[fileName].familyDisplayIndex = index;
        });
        this.setState(newState);
      },
      relateSeeAlso: (file) => {
        console.log("RUN RELATE see also");
        const fileName = file.fileName;
        const makeSet = (array) => {
          let newArray = new Set(array);
          newArray = [...newArray];
          return newArray;
        };
        return new Promise((resolve, reject) => {
          axios
            .get(`/api/artworkInfo/fileName/${fileName}`)
            .then((res) => {
              const newState = { ...this.state };
              const prevSeeAlso = makeSet(res.data[0].seeAlso);
              const currentSeeAlso = makeSet(file.seeAlso);
              const newToAdd = currentSeeAlso.filter((record) => {
                return !prevSeeAlso.includes(record);
              });
              const newToRemove = prevSeeAlso.filter((record) => {
                return !currentSeeAlso.includes(record);
              });
              const removeSeeAlsos = new Promise((resolve, reject) => {
                let counter = 0;
                let progressLength = newToRemove.length;
                if (progressLength === 0) {
                  resolve();
                }
                newToRemove.forEach((seeAlsoParent) => {
                  let fileData = newState.artworkInfoData[seeAlsoParent];
                  let newSeeAlso = fileData.seeAlso.filter(
                    (record) => record !== fileName
                  );
                  newSeeAlso = makeSet(newSeeAlso);
                  fileData.seeAlso = newSeeAlso;
                  axios
                    .put(`/api/artworkInfo/update/${seeAlsoParent}`, fileData)
                    .then((res) => {
                      counter += 1;
                      if (counter === progressLength) {
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      reject();
                    });
                });
              });
              const addSeeAlsos = new Promise((resolve, reject) => {
                let counter = 0;
                let progressLength = newToAdd.length;
                if (progressLength === 0) {
                  resolve();
                }
                newToAdd.forEach((seeAlsoParent) => {
                  let fileData = newState.artworkInfoData[seeAlsoParent];
                  let newSeeAlso = [...fileData.seeAlso, fileName];
                  newSeeAlso = makeSet(newSeeAlso);
                  fileData.seeAlso = newSeeAlso;
                  axios
                    .put(`/api/artworkInfo/update/${seeAlsoParent}`, fileData)
                    .then((res) => {
                      counter += 1;
                      if (counter === progressLength) {
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      reject();
                    });
                });
              });
              Promise.all([removeSeeAlsos, addSeeAlsos])
                .then((res) => {
                  console.log("relateSeeAlso finished");
                  resolve();
                })
                .catch((err) => {
                  console.log("relateSeeAlso FAILED");
                  console.log(err);
                  //  document.location.reload(true)
                  reject();
                });
            })
            //if new file (cannot find file name in database)
            .catch((err) => {
              console.log("new file");
              const newState = { ...this.state };
              const newToAdd = makeSet(file.seeAlso);
              const addSeeAlsos = new Promise((resolve, reject) => {
                let counter = 0;
                let progressLength = newToAdd.length;
                if (progressLength === 0) {
                  resolve();
                }
                newToAdd.forEach((seeAlsoParent) => {
                  let fileData = newState.artworkInfoData[seeAlsoParent];
                  let newSeeAlso = [...fileData.seeAlso, fileName];
                  newSeeAlso = makeSet(newSeeAlso);
                  fileData.seeAlso = newSeeAlso;
                  axios
                    .put(`/api/artworkInfo/update/${seeAlsoParent}`, fileData)
                    .then((res) => {
                      counter += 1;
                      if (counter === progressLength) {
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      reject();
                    });
                });
              });
              addSeeAlsos
                .then((res) => {
                  resolve("single file see also resolve");
                })
                .catch((err) => {
                  reject(err);
                });
            });
        });
      },
      updateSeeAlso: (newValue, parent) => {
        // if(!parent || !newValue){
        //     return
        // }
        let target = null;
        let newState = { ...this.state };
        if (parent) {
          target = newState.fileData.files[parent];
        } else {
          target = newState.familySetupData;
        }
        if (target.seeAlso.includes(newValue)) {
          target.seeAlso = target.seeAlso.filter((value) => value !== newValue);
        } else {
          target.seeAlso = [...target.seeAlso, newValue];
        }
        this.setState(newState);
      },
    }; //END OF file data methods

    //this deals with creating and pulling artwork family data and attaching it to files
    this.familySetupMethods = {
      filterByFamily: (value, fileName) => {
        let newRenderList = {};
        Object.keys(this.state.seeAlsoData.fileList).forEach((fileName) => {
          const file = this.state.seeAlsoData.fileList[fileName];
          if (file.artworkFamily === value) {
            newRenderList = { ...newRenderList, [file.fileName]: file };
            newRenderList.fileNames = Object.keys(newRenderList).map(
              (fileName) => fileName
            );
          }
        });

        this.setState({
          seeAlsoData: {
            ...this.state.seeAlsoData,
            renderFiles: newRenderList,
          },
        });
        // this.setState({renderList: newRenderList})
      },
      getArtworkInfo: () => {
        return new Promise((resolve, rej) => {
          let serverFileNames = null;

          //get an array of all file names in the server
          axios
            .get("/fetchImages")
            .then((res) => {
              serverFileNames = res.data;
              serverFileNames = serverFileNames.map((name) => {
                return name.replace("-thumbnail", "");
              });

              //get all artwork records from database
              axios.get("/api/artworkInfo").then((res) => {
                let databaseFiles = {};
                let usedNames = [];
                //check that a record has a file in the server
                serverFileNames.forEach((fileName) => {
                  res.data.forEach((obj) => {
                    if (
                      obj.fileName === fileName &&
                      !usedNames.includes[fileName]
                    ) {
                      usedNames = [...usedNames, fileName];
                      databaseFiles = { ...databaseFiles, [fileName]: obj };
                      databaseFiles[fileName].useFamilySetup = false;
                    }
                  });
                });

                //add an array of all file object
                // renderFiles.fileNames = Object.keys(renderFiles).filter(fileName => fileName !== "fileList")

                resolve(databaseFiles);
              });
            })
            .catch((err) => rej(err));
        });
      },
      resetRenderFiles: () => {
        let newState = this.state;
        newState.seeAlsoData.renderFiles = {
          ...newState.seeAlsoData.fileList,
          fileNames: newState.seeAlsoData.renderFiles.fileNames,
        };
        this.setState(newState);
      },
      onChange: (value, string, e, cb) => {
        const addNewValue = (newValue) => {
          let newState = {};
          //if state nest is a String, eg artworkFamily
          if (typeof this.state.familySetupData[string] === "string") {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                [string]: newValue,
              },
            };
          }
          //if state nest is Array (eg themes or seeAlso)
          else {
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                [string]: [...this.state.familySetupData[string], newValue],
              },
            };
          }
          // this.setState(newState)
          return newState;
        };

        const removeValue = (value) => {
          let newState = {};
          if (typeof this.state.familySetupData[string] === "string") {
            return;
          } else {
            let newArray = this.state.familySetupData[string].filter(
              (item) => item !== value
            );
            newState = {
              ...this.state,
              familySetupData: {
                ...this.state.familySetupData,
                [string]: newArray,
              },
            };
            // this.setState(newState)
            return newState;
          }
        };

        if (
          this.state.familySetupData[string] &&
          this.state.familySetupData[string].includes(value)
        ) {
          let newState = removeValue(value);
          // this.familySetupMethods.renderAllFiles(newState.familySetupData.seeAlso).then(res => {
          //     let seeAlsoData = {}
          //     newState = {...newState, seeAlsoData: res}
          //     this.setState(newState, () => {if(cb){cb()}})
          // })
          this.setState(newState, () => {
            if (cb) {
              cb();
            }
          });
        } else {
          let newState = addNewValue(value);
          // this.familySetupMethods.renderAllFiles(newState.familySetupData.seeAlso).then(res => {
          //     newState = {...newState, seeAlsoData: res}
          //     this.setState(newState, () => {if(cb){cb()}})
          // })
          this.setState(newState, () => {
            if (cb) {
              cb();
            }
          });
        }
      },
      isChecked: (string, value) => {
        if (string === "artworkFamily") {
          if (this.state.familySetupData.artworkFamily === value) {
            return true;
          } else {
            return false;
          }
        }
        if (this.state.familySetupData[string].includes(value)) {
          return true;
        } else {
          return false;
        }
      },
      getFamilySetup: (value, string, fileName) => {
        return new Promise((resolve, reject) => {
          axios
            .get(`/api/familySetup/${value}`)
            .then((res) => {
              console.log("get family setup res");
              console.log(res);
              let newFamilySetup = {};
              let newState = { ...this.state };

              if (fileName) {
                newFamilySetup = { ...this.state.fileData.files[fileName] };

                Object.keys(res.data).forEach((objKey) => {
                  newFamilySetup = {
                    ...newFamilySetup,
                    [objKey]: res.data[objKey],
                  };
                });

                newState = {
                  ...this.state,
                  fileData: {
                    ...this.state.fileData,
                    files: {
                      ...this.state.fileData.files,
                      [fileName]: newFamilySetup,
                    },
                  },
                };
                let newDisplayTriggers = {};
                newDisplayTriggers.category = Object.keys(res.data.category);

                const getSubcategories = () => {
                  let categories = Object.keys(res.data.category);
                  let subcategories = [];
                  categories.forEach((category) => {
                    subcategories = [
                      ...subcategories,
                      ...Object.keys(res.data.category[category]),
                    ];
                  });
                  return subcategories;
                };
                newDisplayTriggers.subcategory = getSubcategories();

                const getListitems = () => {
                  const categories = Object.keys(res.data.category);
                  let listItems = [];
                  categories.forEach((category) => {
                    let subcategories = Object.keys(
                      res.data.category[category]
                    );
                    subcategories.forEach((sub) => {
                      if (!res.data.category[category][sub].length > 0) {
                        return;
                      }
                      listItems = [
                        ...listItems,
                        ...res.data.category[category][sub],
                      ];
                    });
                  });
                  return listItems;
                };
                newDisplayTriggers.listitems = getListitems();

                newDisplayTriggers.themes = res.data.themes;

                newDisplayTriggers.year = res.data.year;
                newDisplayTriggers.location = res.data.location;

                newState.fileData.files[
                  fileName
                ].displayTriggers = newDisplayTriggers;
              } else if (!fileName) {
                Object.keys(res.data).forEach((objKey) => {
                  newFamilySetup = {
                    ...newFamilySetup,
                    [objKey]: res.data[objKey],
                  };
                });

                newState = { ...this.state, familySetupData: newFamilySetup };
              }

              const withRelatedArtwork = this.familySetupMethods.getRelatedArtwork(
                value,
                newState
              );

              withRelatedArtwork.then((res) => {
                newState = {
                  ...newState,
                  relatedArtwork: { ...newState.relatedArtwork, [value]: res },
                };
                this.setState(newState, () => resolve(res));
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      // restoreFamilySetup: (fileName) => {
      //   let newState = {
      //     ...this.state,
      //     fileData: {
      //       ...this.state.fileData,
      //       files: {
      //         ...this.state.fileData.files,
      //         [fileName]: {},
      //       },
      //     },
      //   };
      // },
      useFamilySetup: (value) => {
        let newState = {
          ...this.state,
          familySetupData: {
            ...this.state.familySetupData,
            useFamilySetup: value,
          },
        };

        this.setState(newState);
      },
      createFamilySetup: () => {
        const artworkFamily = this.state.familySetupData.artworkFamily;
        const category = this.state.familySetupData.category
          ? this.state.familySetupData.category
          : {};
        const familyDescription = this.state.familySetupData.familyDescription
          ? this.state.familySetupData.familyDescription
          : "";
        const themes = this.state.familySetupData.themes
          ? this.state.familySetupData.themes
          : [];
        const relatedArtwork = this.state.familySetupData.relatedArtwork
          ? this.state.familySetupData.relatedArtwork
          : [];
        const seeAlso = this.state.familySetupData.seeAlso
          ? this.state.familySetupData.seeAlso
          : [];
        const location = this.state.familySetupData.location
          ? this.state.familySetupData.location
          : "";
        const year = this.state.familySetupData.year
          ? this.state.familySetupData.year
          : "";

        let requestBody = {
          category: category,
          artworkFamily: artworkFamily,
          familyDescription: familyDescription,
          themes: themes,
          relatedArtwork: relatedArtwork,
          seeAlso: seeAlso,
          location: location,
          year: year,
        };
        return new Promise((resolve, reject) => {
          if (!this.state.familySetupData.artworkFamily) {
            reject("Please select artwork family or add a new one");
          }
          axios
            .post("/api/familySetup/create", requestBody)
            .then((res) => {
              resolve("create fam succes");
            })
            .catch((err) => {
              console.log("create fam failed");
              console.log(err);
              reject("create fam failed");
            });
        });
      },
      updateFamilySetup: (familyName) => {
        const artworkFamily = this.state.familySetupData.artworkFamily;
        const category = this.state.familySetupData.category
          ? this.state.familySetupData.category
          : {};
        const familyDescription = this.state.familySetupData.familyDescription
          ? this.state.familySetupData.familyDescription
          : "";
        const themes = this.state.familySetupData.themes
          ? this.state.familySetupData.themes
          : [];
        const relatedArtwork = this.state.familySetupData.relatedArtwork
          ? this.state.familySetupData.relatedArtwork
          : [];
        const seeAlso = this.state.familySetupData.seeAlso
          ? this.state.familySetupData.seeAlso
          : [];
        const location = this.state.familySetupData.location
          ? this.state.familySetupData.location
          : "";
        const year = this.state.familySetupData.year
          ? this.state.familySetupData.year
          : "";

        let requestBody = {
          category: category,
          artworkFamily: artworkFamily,
          familyDescription: familyDescription,
          themes: themes,
          relatedArtwork: relatedArtwork,
          seeAlso: seeAlso,
          location: location,
          year: year,
        };

        // if(!this.state.familySetupData.artworkFamily){
        //     return
        // }

        return new Promise((resolve, reject) => {
          axios
            .put(`/api/familySetup/update/${familyName}`, requestBody)
            .then((res) => {
              this.fileDataMethods
                .updateArtworkByFamily(familyName)
                .then((res) => {
                  resolve(`Artwork Family ${familyName} succesfully updated`);
                })
                .catch((err) => {
                  console.log("updateArtworkByFamily FAIL");
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
              reject("Artwork family update failed");
            });
        });
      },
      getRelatedArtwork: (artworkFamily, newState) => {
        let relatedArtwork = {};
        //get all records from the selected family from database
        return new Promise((resolve, reject) => {
          axios
            .get(`/api/artworkInfo/${artworkFamily}`)
            .then((res) => {
              res.data.forEach((obj, index) => {
                Object.keys(obj).forEach((property) => {
                  relatedArtwork = {
                    ...relatedArtwork,
                    [obj.fileName]: {
                      ...relatedArtwork[obj.fileName],
                      [property]: obj[property],
                    },
                  };
                });
              });

              if (newState.fileData.files) {
                Object.keys(newState.fileData.files).forEach((fileName) => {
                  if (
                    newState.fileData.files[fileName].artworkFamily ===
                    artworkFamily
                  ) {
                    Object.keys(newState.fileData.files[fileName]).forEach(
                      (property) => {
                        relatedArtwork = {
                          ...relatedArtwork,
                          [fileName]: {
                            ...relatedArtwork[fileName],
                            [property]:
                              newState.fileData.files[fileName][property],
                          },
                        };
                      }
                    );
                  }
                });
              }
              let fileIds = [];
              let noIndex = [];

              Object.keys(relatedArtwork).forEach((fileName, index) => {
                const familyDisplayIndex =
                  relatedArtwork[fileName].familyDisplayIndex;
                if (
                  familyDisplayIndex < 0 ||
                  familyDisplayIndex === null ||
                  undefined
                ) {
                  noIndex.push(fileName);
                } else {
                  fileIds[familyDisplayIndex] = fileName;
                }
              });
              noIndex.forEach((fileName) => fileIds.push(fileName));
              fileIds = fileIds.filter(
                (fileName) => fileName !== null || undefined
              );
              let finalRelatedArtwork = {
                files: relatedArtwork,
                column: {
                  fileIds,
                  id: `${artworkFamily}-relatedArtworks`,
                },
                columnOrder: [`${artworkFamily}-relatedArtworks`],
              };
              resolve(finalRelatedArtwork);
            })
            .catch((err) => {
              console.log(`Failed at getting artwokrFamily ${artworkFamily}`);
            });
        });
      },
      updateContext: (value, propertyName) => {
        return this.setState({ [propertyName]: value });
      },
    }; //end of familySetupMethods

    this.verify = (options) => {
      if (auth.guest) {
        return {
          showModal: true,
          verified: false,
          modalMessage:
            options && options.customMessage
              ? options.customMessage
              : "You do not have the rights for this action. Log in using admin level account",
        };
      } else if (options) {
        if (options.addNew && !this.state.familySetupData.artworkFamily) {
          return {
            verfied: true,
            showModal: true,
            modalMessage:
              options && options.customError
                ? options.customError
                : "Select or add a new artwork family",
          };
        } else {
          return { verified: true };
        }
      } else if (!options) {
        return { verified: true };
      }
    };
    this.staticState = () => {
      let newState = {};

      const getArtworkInfo = () => {
        return new Promise((resolve, rej) => {
          let serverFileNames = null;

          //get an array of all file names in the server
          axios
            .get("/fetchImages")
            .then((res) => {
              serverFileNames = res.data;
              let newServerFileName = res.data.map((name) => {
                let start = name.substring(0, name.indexOf("-thumbnail"));
                let cutout = "-thumbnail";
                let extension = name.substring(
                  name.indexOf("-thumbnail") + cutout.length
                );
                let newName = `${start}${extension}`;
                return newName;
              });

              serverFileNames = newServerFileName;
              axios
                .get("/api/artworkInfo")
                .then((res) => {
                  let databaseFiles = {};
                  let usedNames = [];

                  //check that a record has a file in the server
                  serverFileNames.forEach((fileName) => {
                    res.data.forEach((obj) => {
                      if (
                        obj.fileName === fileName &&
                        !usedNames.includes[fileName]
                      ) {
                        usedNames = [...usedNames, fileName];
                        databaseFiles = { ...databaseFiles, [fileName]: obj };
                        databaseFiles[fileName].useFamilySetup = false;
                      }
                    });
                  });

                  //add an array of all file object
                  // renderFiles.fileNames = Object.keys(renderFiles).filter(fileName => fileName !== "fileList")

                  resolve(databaseFiles);
                })
                .catch((err) => {
                  console.log("getArtworkInfo err");
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log("fetch images err");
              console.log(err);
            });
        });
      };

      const serverFiles = () => {
        return new Promise((resolve, rej) => {
          axios
            .get("/fetchimages")
            .then((res) => {
              newState.serverData = res;
              resolve(res);
            })
            .catch((err) => rej(err));
        });
      };

      const getRelatedArtwork = (artworkFamily, filesData) => {
        return new Promise((resolve, reject) => {
          let relatedArtwork = {};
          axios
            .get(`/api/artworkInfo/${artworkFamily}`)
            .then((res) => {
              res.data.forEach((obj, index) => {
                const dir = "uploads/thumbnails/";
                const thumbnailPath = obj.thumbnailPath;
                const thumbnailFileName = thumbnailPath.slice(
                  dir.length,
                  thumbnailPath.length
                );
                if (filesData.indexOf(thumbnailFileName) > -1) {
                  relatedArtwork[obj.fileName] = obj;
                }
              });
              let fileIds = Object.keys(relatedArtwork).map((obj) => null);
              Object.keys(relatedArtwork).forEach((fileName) => {
                if (relatedArtwork[fileName].familyDisplayIndex < 0) {
                  fileIds.push(fileName);
                } else {
                  fileIds[
                    relatedArtwork[fileName].familyDisplayIndex
                  ] = fileName;
                }
              });
              fileIds = fileIds.filter(
                (fileName) => fileName !== null || false
              );
              let finalRelatedArtwork = {
                files: relatedArtwork,
                column: {
                  fileIds,
                  id: `${artworkFamily}-relatedArtworks`,
                },
                columnOrder: [`${artworkFamily}-relatedArtworks`],
              };
              resolve(finalRelatedArtwork);
            })
            .catch((err) => {
              console.log(
                "axios.get(/api/artworkInfo/artworkFamily) FAILED"
              );
              console.log(err);
              reject(err);
            });
        });
        //get all records from the selected family from database
      };

      const FamilyList = new Promise((resolve, rej) => {
        axios
          .get("/api/familySetup")
          .then((res) => {
            let familyList = Object.keys(res.data).map((obj) => {
              return res.data[obj].artworkFamily;
            });
            let familiesData = {};
            Object.keys(res.data).forEach((obj) => {
              familiesData[res.data[obj].artworkFamily] = res.data[obj];
            });
            newState.familiesData = familiesData;
            newState.artworkFamilyList = familyList;
            resolve();
          })
          .catch((err) => {
            rej(err);
            console.log("family list laod error");
            // document.location.reload(true)
          });
      });

      const Categories = (serverFiles) => {
        return new Promise((resolve, rej) => {
          FamilyList.then((res) => {
            axios
              .get("/api/categories")
              .then((res) => {
                let categoryNames = Object.values(res.data).map(
                  (obj) => obj.category
                );
                let categoryObj = {};
                categoryNames.forEach((categoryName) => {
                  const currentObj = res.data.find(
                    (item) => item.category === categoryName
                  );
                  return (categoryObj = {
                    ...categoryObj,
                    [categoryName]: Object.keys(currentObj.subcategory),
                  });
                });

                newState.categoriesData = res.data;
                newState.categoriesOptionList = {};
                newState.categoriesOptionList.data = categoryObj;

                const progressLength = newState.artworkFamilyList.length;
                let counter = 0;
                newState.artworkFamilyList.forEach((familyName) => {
                  getRelatedArtwork(familyName, serverFiles)
                    .then((res) => {
                      if (!newState.relatedArtwork) {
                        newState.relatedArtwork = {};
                      }
                      newState.relatedArtwork[familyName] = res;
                      counter += 1;
                      if (counter === progressLength) {
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log("get related artwork err");
                      console.log(err);
                      rej("getrelated artwork err");
                    });
                });
                // resolve()
              })
              .catch((err) => {
                console.log("get categories err");
                console.log(err);
                rej("get categories err");
                // document.location.reload(true)
              });
          }).catch((err) => {
            console.log("categories error");
            console.log(err);
            rej(err);
          });
        });
      };

      const ArtworkInfo = new Promise((resolve, rej) => {
        getArtworkInfo()
          .then((res) => {
            newState.artworkInfoData = res;
            let onDisplay = {};

            Object.keys(res).forEach((fileName) => {
              if (res[fileName].displayMain) {
                onDisplay = { ...onDisplay, [fileName]: res[fileName] };
              }
              // if(res[fileName].artworkFamily !== "_archive"){
              //     onDisplay = {...onDisplay, [fileName]: res[fileName]}
              // }
            });

            let allThemes = [];
            Object.keys(res).forEach((objName) => {
              allThemes = [...allThemes, ...res[objName].themes];
            });
            let allThemesSet = new Set(allThemes);
            allThemesSet = Array.from(allThemesSet);

            let artworkByTheme = {};

            let themesArr = Object.keys(res).map((name) => res[name]);

            allThemesSet.forEach((theme) => {
              themesArr.forEach((obj) => {
                if (obj.themes.includes(theme)) {
                  if (!artworkByTheme[theme]) {
                    artworkByTheme[theme] = [];
                  }
                  if (
                    obj.displayTriggers.themes &&
                    obj.displayTriggers.themes.includes(theme)
                  ) {
                    artworkByTheme[theme] = [
                      ...artworkByTheme[theme],
                      obj.fileName,
                    ];
                  }
                }
              });
            });

            let years = [];
            let locations = [];
            let artworkByYear = {};
            let artworkByLocation = {};

            const allFiles = Object.keys(res);

            allFiles.forEach((fileName) => {
              const file = res[fileName];
              if (file.year) {
                years = [...years, file.year];
                if (!artworkByYear[file.year]) {
                  artworkByYear[file.year] = [];
                }
                artworkByYear = {
                  ...artworkByYear,
                  [file.year]: [...artworkByYear[file.year], fileName],
                };
              }
              if (file.location) {
                locations = [...locations, file.location];
                if (!artworkByLocation[file.location]) {
                  artworkByLocation[file.location] = [];
                }
                artworkByLocation = {
                  ...artworkByLocation,
                  [file.location]: [
                    ...artworkByLocation[file.location],
                    fileName,
                  ],
                };
              }
            });

            years = new Set(years);
            years = Array.from(years).sort();

            locations = new Set(locations);
            locations = Array.from(locations).sort();

            const yearLocOnDisplay = {
              years: artworkByYear,
              locations: artworkByLocation,
            };

            newState.yearLocation = {
              years,
              locations,
              visible: yearLocOnDisplay,
              all: yearLocOnDisplay,
            };

            newState.artworkOnDisplay = { ...this.state.artworkOnDisplay };
            newState.visibleArtwork = onDisplay;
            newState.themesOnDisplay = artworkByTheme;
            resolve();
          })
          .catch((err) => {
            console.log("getArtworkInfo err");
            console.log(err);
            rej(err);
          });
      });

      return new Promise((resolve, reject) => {
        serverFiles()
          .then((res) => {
            Promise.all([
              //   serverFiles,
              Categories(res.data),
              ArtworkInfo,
              // Themes,
            ])
              .then((res) => {
                newState.displayOrder = {...this.state.displayOrder}
                newState.categoriesOnDisplay = {}
                newState.categoriesOnDisplay = {...this.state.categoriesOnDisplay}
                const newStaticStateJSON = JSON.stringify(newState);
                const newStaticState = {
                  string: `const staticState = ${JSON.stringify(
                    newState
                  )}; export default staticState`,
                };
                const reqBody = {
                  JSON: newStaticStateJSON,
                  jsImport: newStaticState,
                };
                axios
                  .post(`/staticState`, reqBody)
                  .then((res) => {
                    resolve();
                  })
                  .catch((err) => {
                    console.log("write staticstate file error");
                    console.log(err);
                    reject();
                  });
              })
              .catch((err) => {
                console.log("promise all err");
                console.log(err);
                reject();
              });
          })
          .catch((err) => {
            console.log("server files runs err");
            console.log(err);
            reject();
          });
      });
    };
    this.buildProd = () => {
      return new Promise((resolve, reject) => {
        axios
          .get("/build-prod")
          .then((res) => {
            console.log("production build created");
            resolve("production build created");
          })
          .catch((err) => {
            console.log("build failed");
            reject("build failed");
          });
      });
    };
    this.toggleModal = () => {
      let modal = { ...this.state.modal };
      modal.showModal = false;
      modal.parentModal = false;
      modal.modalMessage = null;
      modal.progress = null;
      this.setState({ modal });
    };
    this.showModal = (modalMessage) => {
      let modal = { ...this.state.modal };
      modal.showModal = true;
      modal.parentModal = true;
      modal.modalMessage = modalMessage || "";
      modal.progress = null;
      this.setState({ modal });
    };
    this.loadingMessage = (MessageText) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Spinner animation="border" variant="success" />
          <span style={{ marginLeft: "20px" }}>{MessageText}</span>
        </div>
      );
    };
    this.buildProd = () => {
      console.log("BUILD PROD LAUNCHED IN PROVIDER");
      axios
        .post("/buildProd")
        .then((res) => {
          console.log("BUILD PROD RES");
          console.log(res);
        })
        .catch((err) => {
          console.log("BUILD PROD ERROR");
          console.log(err);
        });
    };
  } //END OF CONTSTRUCTOR

  componentDidMount() {
    let newState = { ...this.state};

    let Themes = new Promise((resolve, rej) => {
      axios.get("/api/themes").then((res) => {
        newState.themesData = res.data.list;
        resolve();
      });
    });

    let FamilyList = new Promise((resolve, rej) => {
      axios.get("/api/familySetup").then((res) => {
        let familyList = Object.keys(res.data).map((obj) => {
          return res.data[obj].artworkFamily;
        });
        newState.artworkFamilyList = familyList;
        resolve();
      });
    });

    let Categories = new Promise((resolve, rej) => {
      FamilyList.then((res) => {
        axios
          .get("/api/categories")
          .then((res) => {
            let categoryNames = Object.values(res.data).map(
              (obj) => obj.category
            );
            let categoryObj = {};
            categoryNames.forEach((categoryName) => {
              const currentObj = res.data.find(
                (item) => item.category === categoryName
              );
              return (categoryObj = {
                ...categoryObj,
                [categoryName]: Object.keys(currentObj.subcategory),
              });
            });

            newState.categoriesData = res.data;
            newState.categoriesOptionList = {};
            newState.categoriesOptionList.data = categoryObj;

            newState.artworkFamilyList.forEach((familyName) => {
              this.familySetupMethods
                .getRelatedArtwork(familyName, newState)
                .then((res) => {
                  newState.relatedArtwork[familyName] = res;
                });
            });
            resolve();
          })
          .catch((err) => {});
      });
    });

    let ArtworkInfo = new Promise((resolve, rej) => {
      this.familySetupMethods.getArtworkInfo().then((res) => {
        newState.artworkInfoData = res;
        resolve();
      });
    });

    let ServerFiles = new Promise((resolve, rej) => {
      axios.get("/fetchImages").then((res) => {
        const serverFileDir = res.data.map((name) => {
          return name.replace("-thumbnail", "");
        });
        newState.serverFileDir = serverFileDir;
        // newState.serverFileDir = res.data;
        resolve();
      });
    });

    let stateCopy = { ...this.state };
    stateCopy.modal.showModal = true;
    stateCopy.modal.parentModal = true;
    stateCopy.modal.blockClose = true;
    stateCopy.modal.modalMessage = this.loadingMessage("Initializing app...");
    // stateCopy.categoriesOnDisplay = {...this.state.staticState.categoriesOnDisplay}

    function allProgress(proms, promNames, progress_cb) {
      let d = 0;
      let prevPromiseName = null;
      progress_cb(0, prevPromiseName);
      for (const p of proms) {
        p.then(() => {
          prevPromiseName = promNames[d];
          d++;

          progress_cb((d * 100) / proms.length, prevPromiseName);
        });
      }
      return Promise.all(proms);
    }

    this.setState(stateCopy, () => {
      allProgress(
        [Categories, ArtworkInfo, Themes, ServerFiles],
        [`Categories`, `ArtworkInfo`, `Themes`, `ServerFiles`],
        (p, lastPromName) => {
          let progress = p.toFixed(2) - 10;
          if (progress < 0) {
            progress = 0;
          }
          let messageText = `Loading "${lastPromName}"`;
          if (!lastPromName) {
            messageText = `Initializing app...`;
          }
          const modalMessage = this.loadingMessage(messageText);

          this.setState({
            modal: { ...this.state.modal, progress, modalMessage },
          });
        }
      )
        .then((res) => {
          axios.get("/staticState").then((res) => {
            newState.staticState = res.data;
            newState.modal.modalMessage = "Data Loaded";
            newState.modal.progress = 100;
            newState.modal.blockClose = false;
            newState.artworkOnDisplay = res.data.artworkOnDisplay;
            newState.displayOrder = {...res.data.displayOrder}
            newState.categoriesOnDisplay = {...res.data.categoriesOnDisplay}
            this.setState(newState);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,

          categoryMethods: this.categoryMethods,
          onCheck: this.categoryMethods.onCheck,

          fileDataMethods: this.fileDataMethods,
          removeFile: this.fileDataMethods.removeFile,
          uploadFile: this.fileDataMethods.uploadFile,
          addFileToState: this.fileDataMethods.addFileToState,
          onDragEnd: this.fileDataMethods.onDragEnd,

          createFamilySetup: this.familySetupMethods.createFamilySetup,
          getFamilySetup: this.familySetupMethods.getFamilySetup,
          useFamilySetup: this.familySetupMethods.useFamilySetup,
          familySetupMethods: this.familySetupMethods,

          readImageDir: this.readImageDir,
          changeFileName: this.changeFileName,
          onChange: this.onChange,
          verify: this.verify,
          addNew: this.addNew,
          deleteTheme: this.deleteTheme,
          staticState: this.staticState,
          buildProd: this.buildProd,
          inputFamilyDescription: this.inputFamilyDescription,
          setArtworkOnDisplay: this.setArtworkOnDisplay,
          toggleModal: this.toggleModal,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
