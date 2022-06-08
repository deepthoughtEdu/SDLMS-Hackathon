"use strict";

/* globals define */

define("forum/sdlms/dtthon/creator/storyboard", ["api"], function (api) {
	var storyboard = {};
	storyboard.init = function () {
		var task_name = [];
		var task_id = [];
		var taskID,task
		var Alltask=[]
		let assetHtml 
		let countid



		$('.sdlms-container').addClass('cProfile-modal')

		$(`body`).on("click", `[create-asset-btn]`, function () {
			let id =$(this).data('task-id');
			console.log(id)
;					new Asset({
				target: `#${id}`
			})
		});


		$("#project_title").append(`Create Story for ${ajaxify.data.project.title}`);
		$("[collapsed-tasks]").hide();
		$("[collapse-menu-icon]").on("click", function (e) {
			$("[save-btn]").toggle();
			$("[expanded-tasks],[collapsed-tasks]").toggle();
			$("[collapse-header]").text(
				$("[collapse-header]").text() == "" ? "Journey Board" : ""
			);
			$("[collapse]").toggleClass("col-md-2 col-md-1");
		});

		$("#dtthon-type").append(ajaxify.data.project.type)

		$(".dtThone-journey-board")
			.find("[expanded-tasks]")
			.prepend(
				`<div class="text-center p-4">
				<img src="https://sdlms.deepthought.education/assets/uploads/files/files/frame.svg" alt="empty-task">
				<hr/>
				<h5>Your Storyboard seems to be empty</h5>
				<p>Add Task Now!</p>
				<button type="button" id="addtask" class="sdlms-button button-primary button-lg  rounded-sm">Add Task</button>
				</div>
				`
			);

		$('#addtask').on('click', function () {
			$(".dtThone-journey-board")
				.find("[expanded-tasks]").empty()
			$(".dtThone-journey-board")
				.find("[expanded-tasks]")
				.append(
					`<div class="sdlms-floating-label-input d-flex position-relative m-2 input-task">
				<input type="text" placeholder="Enter Name of Your task" class="bg-transparent p-2 border-0 " style="outline:none; width:90%" task-input>
				<span class="p-2 cursor-pointer">
				<div id="add-btn">
				  <svg width="15" height="15" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
					  d="M20.875 9.15625H13.8438V2.125C13.8438 1.26221 13.144 0.5625 12.2812 0.5625H10.7188C9.85596 0.5625 9.15625 1.26221 9.15625 2.125V9.15625H2.125C1.26221 9.15625 0.5625 9.85596 0.5625 10.7188V12.2812C0.5625 13.144 1.26221 13.8438 2.125 13.8438H9.15625V20.875C9.15625 21.7378 9.85596 22.4375 10.7188 22.4375H12.2812C13.144 22.4375 13.8438 21.7378 13.8438 20.875V13.8438H20.875C21.7378 13.8438 22.4375 13.144 22.4375 12.2812V10.7188C22.4375 9.85596 21.7378 9.15625 20.875 9.15625Z"
					  fill="#0029FF" />
				</svg>
				</div>
				</span>
			  </div>
			  <ol></ol>
				`
				);

		})


		

		let count = 0;
		let idCount = 0;

		$('body').on("click", "#add-btn", function () {
			console.log('hello')
			$('.sdlms-container').removeClass('cProfile-modal')
			new Task()
			task = $("[task-input]").val();
			$("[task-input]").val("");
			$(`.task-heading${taskID}`).text(task);
			task_name.push(task);
			var taskitem=taskID
			console.log(taskitem)
			console.log(task_name);
			count++;
			idCount++;
			countid = idCount;
			let taskId = "task-" + idCount;
			let delBtnId = "del-btn-" + idCount;
			let editBtnId = "edit-btn" + idCount;
			$("[expanded-tasks] ol").append(
				`<div id="${countid}" class="pr-2 py-2 d-flex justify-content-between">
        <li id=${taskitem}" class="font-weight-bold px-4 text-wrap cursor-pointer">${task}</li>
        <div class="pr-2 cursor-pointer">

		<svg id="${editBtnId}" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10.4844 2.43505L12.8333 5.07814C12.9323 5.18949 12.9323 5.37117 12.8333 5.48252L7.14583 11.8822L4.72917 12.184C4.40625 12.225 4.13281 11.9174 4.16927 11.554L4.4375 8.83473L10.125 2.43505C10.224 2.3237 10.3854 2.3237 10.4844 2.43505ZM14.7031 1.76402L13.4323 0.33405C13.0365 -0.11135 12.3932 -0.11135 11.9948 0.33405L11.0729 1.37136C10.974 1.48271 10.974 1.66439 11.0729 1.77574L13.4219 4.41883C13.5208 4.53018 13.6823 4.53018 13.7812 4.41883L14.7031 3.38152C15.099 2.93319 15.099 2.20942 14.7031 1.76402ZM10 10.1416V13.1246H1.66667V3.7478H7.65104C7.73437 3.7478 7.8125 3.70971 7.8724 3.64524L8.91406 2.47314C9.11198 2.25044 8.97135 1.87244 8.69271 1.87244H1.25C0.559896 1.87244 0 2.50244 0 3.27896V13.5935C0 14.37 0.559896 15 1.25 15H10.4167C11.1068 15 11.6667 14.37 11.6667 13.5935V8.96953C11.6667 8.65599 11.3307 8.50068 11.1328 8.72045L10.0911 9.89256C10.0339 9.95995 10 10.0479 10 10.1416Z" fill="#0029FF"/>
		</svg>

          <svg id="${delBtnId}" width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z"
              fill="#0029FF" />
          </svg>
        </div>
      </div>
  `)
			$(`#${delBtnId}`).on("click", () => {
				$(`#${taskitem}`).remove();
				$(`#${countid}`).remove();
				Alltask.pop(`${taskID}`)
				task_name.pop(task);
				console.log(Alltask)
				$("[number-list]").children().last().remove();
				count--;
			});
			getNumberList(count);

			$(`#${editBtnId}`).on("click", () => {
				$(`#${taskitem}`).show();
			})


			let data = {
				tid: ajaxify.data.project.tid,
				task: {
					task_title: task_name[0],
					task_description: "desc desc",
				},
			};

			api.post(`/apps/task`, data).then(function (res) {
				task_id.push(res.task_id);
			});
		});

		function getNumberList(count) {
			$("[number-list]").append(`
  <div class= "number-list">${count}</div>
  `);
		}
		let totalTasks = $("[task-list]");
		for (let i = 0; i < totalTasks.length; i++) {
			count++;
			getNumberList(count);
		}
		$("[tool-bar] [collapse-body]").hide();

		$("[tool-bar]").on("click", "[collapse-icon]", function () {
			$("[collapse-body]").animate({
				width: "toggle",
			});
			$(this).toggleClass("rotate");
		});


		class Task {
			constructor() {
				this.builder();
			}

			id() {
				var stamp = new Date().getTime();
				var uuid = "xxxxxxxx_xxxx_xxxx_yxxx_xxxxxxxxxxxx".replace(
					/[xy]/g,
					function (c) {
						var r = (stamp + Math.random() * 16) % 16 | 0;
						stamp = Math.floor(stamp / 16);
						return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
					}
				);
				return uuid.replaceAll("_", "-");
			}


			builder() {
				taskID = this.id();
				console.log(taskID)
				var taskcontainer=taskID
				var task_html = `<div class="sdlms-section session-view sdlms-form-elements" id="${taskcontainer}" taskID=${taskID}>
				<div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header align-items-center justify-content-between ">
				  <div id="project_title${taskID}" class="d-flex align-items-center sdlms-text-white-20px "></div>
				</div>
				<h1 class="sdlms-text-black-22px mt-4 task-heading${taskID}" style="text-align:center;"> </h1>
				<div class="col-md-11" style="margin-left:40px;padding-bottom: 10px;">
				  <div class="col-12 p-0 pt-4">
					<div class="d-flex align-items-center justify-content-end" create-assets style="padding-bottom: 10px;">
					  <button type="button" class="sdlms-button button-primary button-md d-flex align-items-center" create-asset-btn data-task-id="${taskID}">Add Asset</button>
					</div>
					<div class="row mb-4" id="storyboard-asset${taskID}">
					</div>
				  </div>
				</div>`

				$("#create-task").append(task_html);
				$(`#project_title${taskID}`).append(`Create Story for ${ajaxify.data.project.title}`);
			}
		}
				class Asset {
					constructor( data = {} ) {
						this.target = data.target;
						this.builder();
					}

					id() {
						var stamp = new Date().getTime();
						var uuid = "xxxxxxxx_xxxx_xxxx_yxxx_xxxxxxxxxxxx".replace(
							/[xy]/g,
							function (c) {
								var r = (stamp + Math.random() * 16) % 16 | 0;
								stamp = Math.floor(stamp / 16);
								return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
							}
						);
						return uuid.replaceAll("_", "-");
					}

					builder() {
						var assetID = this.id();
						let $that = this;
					

						assetHtml = `
				<div class="col-md-6 my-2 mx-auto mb-5" assetID="${assetID}">
				    <div class="sdlms-section sdlms-form-elements">
					    <div class="sdlms-section-header shadow-none secondary-header align-items-center justify-content-between" header-asset-div>
					        <div class="d-flex justify-content-center align-items-center w-100 cursor-pointer">
						        <span class="sdlms-floating-right cursor-pointer m-1" style="z-index: 1;" add-to-headerAsset${assetID}>
						            <svg width="25" height="11" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							            <path d="M8.4911 18.2766L0.366101 10.1516C-0.122034 9.66351 -0.122034 8.87206 0.366101 8.38387L2.13383 6.6161C2.62196 6.12792 3.41346 6.12792 3.9016 6.6161L9.37499 12.0894L21.0984 0.366101C21.5865 -0.122034 22.378 -0.122034 22.8662 0.366101L24.6339 2.13387C25.122 2.62201 25.122 3.41346 24.6339 3.90165L10.2589 18.2767C9.77069 18.7648 8.97924 18.7648 8.4911 18.2766Z" fill="#0029FF" />
						            </svg>
						        </span>
						        <div class="d-flex align-items-center sdlms-text-white-20px w-100" new-header-asset>
						            <textarea id="asset_heading${assetID}" class="form-control py-1 w-100" placeholder="Asset Name" name="content" rows="1" col="10"></textarea>
						        </div>
					        </div>
					    </div>
					    <div class="sdlms-section-body">
					        <div class="d-flex">
						        <div class="col-md-12 pl-0">
						            <div class="d-flex flex-column align-items-center mt-4 justify-content-between">
							            <div class="sdlms-floating-label">
										    Select Asset Option:
									    </div>
							            <select class="custom-select cursor-pointer form-control label-radius align-item-center form-control pl-3" id="inputGroupSelect02" style="z-index:1" assetTypeDropdown${assetID}>
							                <option selected>Choose type of asset...</option>
							                <option value="input_asset">Input Asset</option>
							                <option value="display_asset">Display Asset</option>
							            </select>
						            </div>
						        </div>
					        </div>
					        <div class="d-flex">
						        <div class="col-md-12 pl-0 " assetContent${assetID}>
						            <div class="d-flex flex-column align-items-center mt-4 justify-content-between">
							            <div class="sdlms-floating-label">
										    What you want as Asset??
										</div>
							            <select class="custom-select cursor-pointer label-radius align-item-center form-control pl-3" id="inputGroupSelect06" style="z-index:1" assetContentDropdown${assetID}>
							                <option value="none" selected>Choose asset content to be shown...</option>
							                <option value="re">Reflection</option>
							                <option value="tb">Thread Builder</option>
							                <option value="eb">Eagle Builder</option>
							                <option value="ar">Article</option>
							                <option value="qz">Quiz</option>
							                <option value="fo">Form</option>
							                <option value="ss">Spread Sheet</option>
							                <option value="ot">Other (Video, Image...)</option>
							            </select>
						            </div>
						        </div>
					        </div>
					        <div class="d-flex">
						        <div class="col-12 pl-0" style="display:none" customOption${assetID}>
						            <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between" customSelect>
							            <div class="sdlms-floating-label">
										    Custom Select
										</div>
							            <svg class="sdlms-floating-right mr-3 pb-3" width="12" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg" customArrow${assetID}>
							                <path d="M2.11523 10L9 3.81909L15.8848 10L18 8.09713L9 0L0 8.09713L2.11523 10Z" fill="black" />
							            </svg>
							            <textarea displayAssetLink${assetID} class="form-control label-text" placeholder="Paste Your Link Here" rows="1"></textarea>
							          <!--  <svg class="searchIcon sdlms-floating-right mt-4 mr-3 pt-2 fill=" #000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px">
							                <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z" />
							            </svg> -->
						            </div>
						        </div>
					        </div>
					        <div class="d-flex">
						        <div class="col-md-12 pl-0 " linkTypeDropdown${assetID} style="display:none;">
						            <div class="d-flex flex-column align-items-center mt-4 justify-content-between">
							            <div class="sdlms-floating-label">
										    Which you want to give??
										</div>
							            <select class="custom-select cursor-pointer label-radius align-item-center form-control pl-3" id="inputGroupSelect04" style="z-index:1" linkContentDropdown${assetID}>
                                            <option value="none" selected>Choose link content to be shown...</option>
							                <option value="video">Video</option>
							                <option value="img">Image</option>
							                <option value="audio">Audio</option>
							                <option value="docs">Document</option>
							            </select>
						            </div>
						        </div>
					        </div>
				            <div class="d-flex">
				                <div class=" col-12 pl-0 " reflection${assetID} style="display:none;">
				                    <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
				                        <div class="sdlms-floating-label">
										    Reflection
										</div>
				                        <textarea class="form-control" placeholder="Enter reflection to be shown" name="content" rows="5" no-of-characters maxlength="500" reflectionInput${assetID}></textarea>
				                        <label class="holder"><span class="sdlms-text-primary-12px"><span show-characters>0</span>/500</span></label>
				                    </div>
				                </div>
			                </div>
					        <div class="d-flex">
						        <div class=" col-12 pl-0">
						            <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
							            <div class="sdlms-floating-label">
										    Description
										</div>
							            <textarea class="form-control" placeholder="Enter the description of the asset" name="content" rows="4" no-of-characters maxlength="200" description${assetID}></textarea>
							            <label class="holder"><span class="sdlms-text-primary-12px"><span show-characters>0</span>/200</span></label>
						            </div>
						        </div>
					        </div>
					        <div class="col-12 pl-0 d-flex mt-4 align-items-center justify-content-between">
						        <button type="submit" class="sdlms-button button-primary button-md d-flex align-items-center" createAsset${assetID}>Create Asset</button>
								<button type="submit" class="sdlms-button button-primary button-md d-flex align-items-center" SaveAsset${assetID}>Save Asset</button>
					        </div>
					    </div>
				    </div>
				</div>`;

						let threadBuilderasset = `<div class="cProfile-modal change-class d-flex justify-content-center align-items-center">
				<div class="cProfile-modal-content">

			<div class="sdlms-section session-view sdlms-form-elements">
			<div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header align-items-center justify-content-between ">
			  <div  class=" align-items-center sdlms-text-white-20px" style="text-align:center;">
				<span class="sdlms-floating-left">
				  <svg id="threadbuilder-backbtn" width="20" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10.5261 18L13 15.8849L4.96494 9L13 2.11505L10.5261 0L0 9L10.5261 18Z" fill="white" />
					<line x1="5" y1="9" x2="26" y2="9" stroke="white" stroke-width="4" />
				  </svg>
				</span>
				<div id="pageTitle">Select Threadbuilder</div>
			  </div>
			</div>
			<div class="sdlms-section-body">
            <!-- append here -->


                </div>
				</div>
				</div>
				`

				        console.log($($that.target))
						if(!$($that.target)){
							return
						}
				        $($that.target).append(assetHtml);
						// $(`#storyboard-asset${taskID}`).append(assetHtml);
						// after adding the target
						//$(`[assetID]`).on("click", "[edit-icon]", this.assetHeader);




						$(`[assetID]`).on("click", `[add-to-headerAsset${assetID}]`, function () {
							let value = $(`#asset_heading${assetID}`).val();
							let assetTitle = `
				<div class="d-flex align-items-center sdlms-text-white-20px" header>
				<div class="d-flex justify-content-center align-items-center w-100 cursor-pointer" header-text>
				  <span assetSelectionLabel${assetID} class="pt-1">${value ? value : "Asset Name"
								}</span>
				</div>
			  </div>
			  <div edit-icon${assetID} style="display: none;">
			  <svg class="sdlms-floating-left" width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M10.4844 2.43505L12.8333 5.07814C12.9323 5.18949 12.9323 5.37117 12.8333 5.48252L7.14583 11.8822L4.72917 12.184C4.40625 12.225 4.13281 11.9174 4.16927 11.554L4.4375 8.83473L10.125 2.43505C10.224 2.3237 10.3854 2.3237 10.4844 2.43505ZM14.7031 1.76402L13.4323 0.33405C13.0365 -0.11135 12.3932 -0.11135 11.9948 0.33405L11.0729 1.37136C10.974 1.48271 10.974 1.66439 11.0729 1.77574L13.4219 4.41883C13.5208 4.53018 13.6823 4.53018 13.7812 4.41883L14.7031 3.38152C15.099 2.93319 15.099 2.20942 14.7031 1.76402ZM10 10.1416V13.1246H1.66667V3.7478H7.65104C7.73437 3.7478 7.8125 3.70971 7.8724 3.64524L8.91406 2.47314C9.11198 2.25044 8.97135 1.87244 8.69271 1.87244H1.25C0.559896 1.87244 0 2.50244 0 3.27896V13.5935C0 14.37 0.559896 15 1.25 15H10.4167C11.1068 15 11.6667 14.37 11.6667 13.5935V8.96953C11.6667 8.65599 11.3307 8.50068 11.1328 8.72045L10.0911 9.89256C10.0339 9.95995 10 10.0479 10 10.1416Z" fill="white"/>
			  </svg>
			  </div>
			  <div delete-icon${assetID} style="display: none;">
				<svg class="sdlms-floating-right" width="20" height="20" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				  <path
					d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z"
					fill="white" />
				</svg>
			  </div>`;
							$(this).parents("[header-asset-div]").html(assetTitle);
						});

						$("[assetID]").on("input", `[description${assetID}]`, this.characterCount);
						$("[assetID]").on("input", `[reflectionInput${assetID}]`, this.characterCount);

						$("[assetID]").on("change", `[assetTypeDropdown${assetID}]`, function () {
							if ($(`[assetTypeDropdown${assetID}]`).val() == "display_asset") {
								$(`[assetContentDropdown${assetID}]`).on("change", function () {
									let content = $(`[assetContentDropdown${assetID}]`).val();
									console.log(content);
									if (content == "ot") {
										$(`[linkTypeDropdown${assetID}]`).show();
									} else {
										$(`[linkTypeDropdown${assetID}]`).hide();
									}
									if (content == "re") {
										$(`[reflection${assetID}]`).show();
									} else {
										$(`[reflection${assetID}]`).hide();
									}
									if (content == "tb") {
										$(".creator-storyboard-Publish-modal").append(threadBuilderasset);
										$(".cProfile-modal").removeClass("change-class");
									} else {
										$(".cProfile-modal").remove();
										$(".cProfile-modal").addClass("change-class");
									}
								});
							}
						});

						$("[assetID]").on("change", `[linkContentDropdown${assetID}]`, function () {
							$(`[linkTypeDropdown${assetID}]`).hide();
							$(`[customOption${assetID}]`).show();
						});

						$(`[customArrow${assetID}]`).on("click", function () {
							console.log("hello");
							$(`[customOption${assetID}]`).hide();
							$(`[linkTypeDropdown${assetID}]`).show();
						});

						$(`[SaveAsset${assetID}]`).addClass('change-class')

						$("[assetID]").on("click", `[edit-icon${assetID}]`, function () {
							$(`[createAsset${assetID}]`).addClass('change-class')
							$(`[SaveAsset${assetID}]`).removeClass('change-class')
						})



						// $(`[saveAsset${assetID}]`).on('click',function(){
						// 	var data = {
						// 		tid: ajaxify.data.project.tid,
						// 		asset:{
						// 			asset_title: ,
						// 			asset_description: ,
						// 			asset_link: ,
						// 		},
						// 		task_id: ,
						// 		asset_id: ,
						// 	};
						// 	api
						// 		.put(`/apps/asset`, data)
						// 		.then(function (res) {
						// 			console.log(res);
						// 		})
						// 		.catch((error) => {
						// 			notify(error.message, "error");
						// 		});

						// })

						$("[assetID]").on("click", `[createAsset${assetID}]`, function () {
							$("#finish-btn").show();
							$(`[createAsset${assetID}]`).prop("disabled", true);
							$(`[delete-icon${assetID}]`).show();
							$(`[edit-icon${assetID}]`).show();
							var assetContent = $(`[assetContentDropdown${assetID}]`).val();
							var linkContent = $(`[linkContentDropdown${assetID}]`).val();
							var assetType = $(`[assetTypeDropdown${assetID}]`).val();
							var contentType, displayAssetLink = null,
								displayAssetImage = null,
								displayAssetVideo = null,
								displayAssetDocs = null;
							console.log($(`[reflectionInput${assetID}]`).val());

							if (assetType == "none" || assetContent == "none") {
								alert("Please select an asset type and content");
							}

							switch (assetContent) {
							case "re":
								contentType = "reflection";
								break;

							case "tb":
								contentType = "tb";
								break;

							case "eb":
								contentType = "eb";
								break;

							case "ar":
								contentType = "article";
								break;

							case "qz":
								contentType = "quiz";
								break;

							case "ot":
								contentType = "other";
								if (assetType == "display_asset") {
									switch (linkContent) {
									case "img":
										displayAssetImage = $(`[displayAssetLink${assetID}]`).val();
										break;
									case "video":
										displayAssetVideo = $(`[displayAssetLink${assetID}]`).val();
										break;
									case "docs":
										displayAssetDocs = $(`[displayAssetLink${assetID}]`).val();
										break;
									case "audio":
										displayAssetLink = $(`[displayAssetLink${assetID}]`).val();
										break;
									}
								}
								break;
							case "fo":
								contentType = "form";
								break;

							case "ss":
								contentType = "spreadsheet";
								break;
							}

							let assetData1 = {
								tid: ajaxify.data.project.tid,
								task_id: task_id[0],
								asset: {
									asset_title: $(`[assetSelectionLabel${assetID}]`).text(),
									asset_description: $(`[description${assetID}]`).val(),
									asset_type: assetType,
									asset_content: contentType,
									asset_url: displayAssetLink,
									asset_image: displayAssetImage,
									asset_video: displayAssetVideo,
									asset_docs: displayAssetDocs,
									asset_reflection: $(`[reflection${assetID}]`).val(),
								},
							};

							let assetData2 = {
								tid: ajaxify.data.project.tid,
								task_id: task_id[0],
								asset: {
									asset_title: $(`[assetSelectionLabel${assetID}]`).text(),
									asset_description: $(`[description${assetID}]`).val(),
									asset_type: assetType,
									asset_content: contentType,
								},
							};

							if (assetType == "display_asset") {
								api.post(`/apps/asset`, assetData1).then(function (res) {
									console.log(res);
								});
							} else {
								api.post(`/apps/asset`, assetData2).then(function (res) {
									console.log(res);
								});
							}
						});

						$(`[assetID]`).on("click", `[delete-icon${assetID}]`, function () {
							$(this).parents("[AssetID]").remove();
							var assetDeleted = {
								tid: ajaxify.data.project.tid,
								task_id: task_id[0],
								//asset_id:,
							}
							api.delete(`/apps/asset`, assetDeleted).then(function (res) {
								console.log(res);
							}).catch((error) => {
								notify(error.message, "error");
							});
						});
					}

					characterCount() {
						let ML = $(this).attr("maxlength");
						let CL = $(this).val().length;
						if (CL >= ML) {
							return alert("You have reached the maximum number of characters.");
						} else {
							$(this).next().find("[show-characters]").text(CL);
						}
					}

					/*  assetHeader(e) {
				let assetEditHtml = `
				<div class="d-flex justify-content-center align-items-center w-100 cursor-pointer">
				  <span class="sdlms-floating-right cursor-pointer" style="z-index: 1;" add-to-headerAsset>
					  <svg width="25" height="11" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						  <path
							  d="M8.4911 18.2766L0.366101 10.1516C-0.122034 9.66351 -0.122034 8.87206 0.366101 8.38387L2.13383 6.6161C2.62196 6.12792 3.41346 6.12792 3.9016 6.6161L9.37499 12.0894L21.0984 0.366101C21.5865 -0.122034 22.378 -0.122034 22.8662 0.366101L24.6339 2.13387C25.122 2.62201 25.122 3.41346 24.6339 3.90165L10.2589 18.2767C9.77069 18.7648 8.97924 18.7648 8.4911 18.2766Z"
							  fill="#0029FF" />
					  </svg>
				  </span>
				  <div class="d-flex align-items-center sdlms-text-white-20px w-100" new-header-asset>
					  <textarea id="asset_header"
						  class="form-control py-1 w-100" placeholder="Asset Name" name="content" rows="1"
						  col="10"></textarea>
				  </div>
				</div>
			`;
				$(this).parent().html(assetEditHtml);
				$(this).parent().toggleClass('p-1 pl-3')
				$(this).remove();
			  }*/
				}

			

		

		
		
		/*  $("body").on("click", ".searchIcon", function() {
	  console.log("hello");
	  location.href = `/myassets/explore`;
	}); */

		//to update status of project






		$("#finish-btn").on("click", function () {
			console.log("hello")
			$("#creator-storyboard-Publish-modal").append(`
			<div class="cProfile-modal change-class">
			<div class="modal publish-modal d-flex align-items-center justify-content-center" tabindex="-1" role="dialog">
			<div class="modal-dialog absolute-center" role="document" style="height:auto">
			  <div class="modal-content">
				<div class="modal-header">
				  <button id="close-btn" type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				  </button>
				</div>
				<div class="modal-body">
				  <p>Do You Want To Publish Project ?</p>
				</div>
				<div class="modal-footer">
				<button type="button" id="back-btn" class="btn btn-secondary button-primary rounded-sm" data-dismiss="modal">Back</button>
				  <button type="button" id="publish" class="sdlms-button button-primary button-lg  rounded-sm">Publish</button>
				</div>
			  </div>
			</div>
		  </div>
		  </div>`);
			$(".cProfile-modal").removeClass("change-class");
		})

		$("body").on("click", "#back-btn", function () {
			$(".cProfile-modal").remove();
			$(".cProfile-modal").addClass("change-class");
		})

		$("body").on("click", "#close-btn", function () {
			$(".cProfile-modal").remove();
			$(".cProfile-modal").addClass("change-class");
		})

		$('body').on('click', '#threadbuilder-backbtn', function () {
			$(".cProfile-modal").remove();
			$(".cProfile-modal").addClass("change-class");
		})

		$("body").on("click", "#publish", function () {
			alert("Your project is published.");
			$(".cProfile-modal").remove();
			$(".cProfile-modal").addClass("change-class");
			var data = {
				tid: ajaxify.data.project.tid,
				status: "published",
			};
			api
				.put(`/apps/project`, data)
				.then(function (res) {
					console.log(res);
				})
				.catch((error) => {
					notify(error.message, "error");
				});
		});

	};
	return storyboard;
});

/*  assetHeader(e) {
		let assetEditHtml = `
		<div class="d-flex justify-content-center align-items-center w-100 cursor-pointer">
		  <span class="sdlms-floating-right cursor-pointer" style="z-index: 1;" add-to-headerAsset>
			  <svg width="25" height="11" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
				  <path
					  d="M8.4911 18.2766L0.366101 10.1516C-0.122034 9.66351 -0.122034 8.87206 0.366101 8.38387L2.13383 6.6161C2.62196 6.12792 3.41346 6.12792 3.9016 6.6161L9.37499 12.0894L21.0984 0.366101C21.5865 -0.122034 22.378 -0.122034 22.8662 0.366101L24.6339 2.13387C25.122 2.62201 25.122 3.41346 24.6339 3.90165L10.2589 18.2767C9.77069 18.7648 8.97924 18.7648 8.4911 18.2766Z"
					  fill="#0029FF" />
			  </svg>
		  </span>
		  <div class="d-flex align-items-center sdlms-text-white-20px w-100" new-header-asset>
			  <textarea id="asset_header"
				  class="form-control py-1 w-100" placeholder="Asset Name" name="content" rows="1"
				  col="10"></textarea>
		  </div>
		</div>
	`;
		$(this).parent().html(assetEditHtml);
		$(this).parent().toggleClass('p-1 pl-3')
		$(this).remove();
	  }*/

/*  $("body").on("click", ".searchIcon", function() {
console.log("hello");
location.href = `/myassets/explore`;
}); */