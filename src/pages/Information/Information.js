import { useEffect, useState, useRef } from "react";
import BackIcons from "../../assets/images/back-arrow.png";
import "./InformationStyle.css";
import Profile from "../../assets/images/avatar_image.png";
import Face from "../../assets/images/face.png";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useReactToPrint } from "react-to-print";
import Printer from "../../components/Printer/Printer";
import { Toast } from "../../components/Toast/Toast";
import axios from "axios";
import { url_devel } from "../../services/env";
import ImageSucces from "../../assets/images/image-2.svg";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbNetwork } from "react-icons/tb";
import { IoCameraOutline } from "react-icons/io5";
import { BsPrinter } from "react-icons/bs";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import VideoPlayer from "../../components/VideoPlayer";

const Information = () => {
	const socket2_IO_4000 = io("http://localhost:4000");
	const [newWifiResults, setNewWifiResults] = useState("");
	const [oldPasswordWarning, setOldPasswordWarning] = useState(false);
	const [newPasswordWarning, setNewPasswordWarning] = useState(false);
	const [confirmPasswordWarning, setConfirmPasswordWarning] = useState(false);
	const [urlKamera, setUrlKamera] = useState("");
	const [streamKamera, setStreamKamera] = useState(false);
	const printRef = useRef();
	const navigate = useNavigate();
	const [ipCamera, setIpCamera] = useState("");
	const [statusCamera, setStatusCamera] = useState("OFF");
	const [isSucces, setIsSucces] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(true);
	const [showNewPassword, setShowNewPassword] = useState(true);
	const [showConfirmPassword, setShowConfirmPassword] = useState(true);
	const [statusCardReader, setStatusCardReader] = useState("OFF");
	const [loading, setLoading] = useState(false);
	const [capturedImageTest, setCapturedImageTest] = useState("");
	const [succesCapture, setSuccesCapture] = useState(false);


	const handleTakePhoto = async () => {
		console.log("handleTakenPhoto");
		setLoading(true);
		socket2_IO_4000.emit("take_photo");
	};

	useEffect(() => {
		socket2_IO_4000.on("photo_taken", (imageBase64) => {
			setLoading(false);
			setStreamKamera(false);
			setSuccesCapture(true);
			console.log("imagebase64", imageBase64);
			setCapturedImageTest(imageBase64);
			console.log("Image_path_received: ", imageBase64);

			socket2_IO_4000.emit("stop_stream");
		});
	}, [socket2_IO_4000]);

	const handleShowOldPassword = () => {
		setShowOldPassword(!showOldPassword);
	};

	const handleShowNewPassword = () => {
		setShowNewPassword(!showNewPassword);
	};

	const handleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};
	const listConfiguration = [
		{
			name: "Profile",
			icon: FaRegUserCircle,
		},
		{
			name: "Change Password",
			icon: RiLockPasswordLine,
		},
		{
			name: "IP Config",
			icon: TbNetwork,
		},
		{
			name: "Test Camera",
			icon: IoCameraOutline,
		},
		{
			name: "Test Printer",
			icon: BsPrinter,
		},
	];
	// const listIcons = [
	//   FaRegUserCircle,
	//   FaRegUserCircle,
	//   FaRegUserCircle,
	//   FaRegUserCircle,
	//   FaRegUserCircle,
	//   // ChangePasswordIcons,
	//   // IPConfigIcons,
	//   // TestCameraIcons,
	//   // TestPrinterIcons,
	// ];

	const [currentTab, setCurrentTab] = useState(0);
	const [isWaiting, setIsWaiting] = useState(false);

	const dataUser = JSON.parse(localStorage.getItem("user"));
	// console.log("DataUser", dataUser);

	const DataUser = {
		fullName: dataUser?.fullName || "Test Petugas",
		email: dataUser?.email || "testpetugas@gmail.com",
		address: dataUser?.organization.officeName || "Test Office",
		officeCity: dataUser?.organization.officeCity || "Test City",
		position: dataUser?.position || "Test Position",
	};

	// console.log("DataUserProfile", DataUser);

	const handleSubmitChangePassword = async (event) => {
		// console.log("masukSini")
		event.preventDefault();
		const oldPassword = event.target.oldPassword.value;
		const newPassword = event.target.newPassword.value;
		const confirmPassword = event.target.confirmPassword.value;
		const dataSendToApi = {
			username: dataUser.username,
			password: oldPassword,
			newPassword: newPassword,
		};
		if (oldPassword === "") {
			setOldPasswordWarning(true);
		} else if (newPassword === "") {
			setNewPasswordWarning(true);
		} else if (confirmPassword === "") {
			setConfirmPasswordWarning(true);
		} else if (newPassword !== confirmPassword) {
			setOldPasswordWarning(false);
			setNewPasswordWarning(false);
			setConfirmPasswordWarning(false);
			Toast.fire({
				icon: "error",
				title: "New password and confirm password must be the same",
			});
		} else if (
			oldPassword !== "" &&
			newPassword !== "" &&
			confirmPassword !== "" &&
			newPassword === confirmPassword
		) {
			setOldPasswordWarning(false);
			setNewPasswordWarning(false);
			setConfirmPasswordWarning(false);
			// console.log("masukSini2")
			try {
				setIsWaiting(true);
				const responseLogin = await axios.post(
					`${url_devel}Login.php`,
					{
						username: dataUser.username,
						password: oldPassword,
					}
				);
				if (
					responseLogin.data.JwtToken.token !== null &&
					responseLogin.data.JwtToken.token !== "" &&
					responseLogin.data.status === "success"
				) {
					localStorage.setItem(
						"JwtToken",
						responseLogin.data.JwtToken.token
					);
					const userProfile = await axios.get(
						`${url_devel}ProfileMe.php`,
						{
							headers: {
								Authorization: `Bearer ${responseLogin.data.JwtToken.token}`,
							},
						}
					);

					if (
						userProfile.data.user_data !== null &&
						userProfile.data.price !== null &&
						userProfile.data.api !== null
					) {
						if (
							userProfile.data.api.key ===
							localStorage.getItem("key") &&
							userProfile.data.api.token ===
							localStorage.getItem("token")
						) {
							localStorage.setItem(
								"key",
								userProfile.data.api.key
							);
							localStorage.setItem(
								"token",
								userProfile.data.api.token
							);
							localStorage.setItem(
								"user",
								JSON.stringify(userProfile.data.user_data)
							);
							localStorage.setItem(
								"price",
								JSON.stringify(userProfile.data.price)
							);
							try {
								const response = axios.post(
									`${url_devel}ChangePassword.php`,
									dataSendToApi,
									{
										headers: {
											Authorization: `Bearer ${localStorage.getItem(
												"JwtToken"
											)}`,
										},
									}
								);
								// console.log("responseChangePassword", (await response).data);
								if ((await response).status === 200) {
									if (
										(await response).data.message ===
										"Unauthorized"
									) {
										Toast.fire({
											icon: "error",
											title: `${(await response).data.message
												}!`,
										});
										setIsWaiting(false);
									} else {
										Toast.fire({
											icon: "success",
											title: "Change password success",
										});
										setIsWaiting(false);
										setIsSucces(true);
										setTimeout(() => {
											setIsSucces(false);
											navigate("/home");
											localStorage.removeItem("user");
											localStorage.removeItem("JwtToken");
											localStorage.removeItem(
												"cardNumberPetugas"
											);
											localStorage.removeItem("key");
											localStorage.removeItem("token");
											localStorage.removeItem(
												"jenisDeviceId"
											);
											localStorage.removeItem("deviceId");
											localStorage.removeItem(
												"airportId"
											);
											localStorage.removeItem("price");
										}, 2000);
									}
								} else {
									Toast.fire({
										icon: "error",
										title: response.message,
									});
									setIsWaiting(false);
								}
							} catch (error) {
								// console.log("error", error);
								Toast.fire({
									icon: "error",
									title: "Failed to Change Password",
								});
								setIsWaiting(false);
							}
						} else if (
							userProfile.data.api.key !==
							localStorage.getItem("key") &&
							userProfile.data.api.token !==
							localStorage.getItem("token")
						) {
							Toast.fire({
								icon: "error",
								title: "Please use the same account from the previous login",
							});
							setIsWaiting(false);
						} else {
							setIsWaiting(false);
							Toast.fire({
								icon: "error",
								title: "Please use the same account from the previous login",
							});
						}
					} else {
						setIsWaiting(false);
						Toast.fire({
							icon: "error",
							title: "Failed to Change Password",
						});
					}
				} else if (
					responseLogin.data.status === "error" ||
					responseLogin.data.message === "Login failed"
				) {
					// setIsWaiting(false);
					Toast.fire({
						icon: "error",
						title: "Please use the same account from the previous login",
					});
				} else {
					setIsWaiting(false);
					Toast.fire({
						icon: "error",
						title: "Username or Password Invalid!",
					});
				}
			} catch (error) {
				setIsWaiting(false);
				// console.log(error);
				Toast.fire({
					icon: "error",
					title: "Your old password is incorrect!",
				});
			}
		}
	};

	const handleOldPasswordChange = (e) => {
		if (e.target.value !== "") {
			setOldPasswordWarning(false);
		}
	};

	const handleNewPasswordChange = (e) => {
		if (e.target.value !== "") {
			setNewPasswordWarning(false);
		}
	};

	const handleConfirmPasswordChange = (e) => {
		if (e.target.value !== "") {
			setConfirmPasswordWarning(false);
		}
	};

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	const handleBackToApply = () => {
		navigate("/home");
	};

	const handleSubmit = (event) => {
		console.log("MASUKKESINIMASE");
		Toast.fire({
			icon: "success",
			title: "Data saved successfully",
		});
		event.preventDefault(); // Prevent default form submission behavior

		const socket = io("http://localhost:4000");

		const socket2 = io("http://localhost:4001");

		// Create data object
		const data = {
			ipServerCamera: ipCamera,
		};

		// Emit data over socket
		socket.emit("saveCameraData", data);
		socket2.emit("saveCameraData", data);
		setTimeout(() => {
			window.location.reload();
			// setStatusCamera("ON");
		}, 2000);
	};

	const startStream = () => {
		setLoading(true);
		const socketCamera = io("http://localhost:4001");
		socketCamera.on("stream_camera", (stream_url) => {
			setUrlKamera(stream_url);
			// setLoading(false);
			// console.log("masuksiniKAMERASTREAM");
			// console.log("data_url_stream", stream_url);
		});
		socketCamera.emit("start_stream");
		setTimeout(() => {
			setLoading(false);
			setStreamKamera(true);
		}, 3000);
	};


	useEffect(() => {
		const socketCamera = io("http://localhost:4001");
		socketCamera.on("cameraDataToClient", (data) => {
			setIpCamera(data.ipServerCamera);
			socketCamera.emit("stop_stream");
		});
		socketCamera.on("cameraStatus", (data) => {
			setStatusCamera(data.status);
		});
	}, []);

	useEffect(() => {
		if (currentTab === 4) {
			handlePrint();
			setTimeout(() => {
				setCurrentTab(0);
			}, 2000);
		}
	}, [currentTab, handlePrint]);

	return (
		<div className="bg-home">
			<div className="bg-information-container">
				<div className="bg-configuration">
					<div className="configuration-kiri">
						<div className="container-kiri">
							{isWaiting ? (
								<>
									<div className="loading-container">
										<h2 style={{ color: "#3d5889" }}>
											Please Wait...
										</h2>
									</div>
								</>
							) : isSucces ? (
								<>
									<div
										className="loading-container"
										style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<h2 style={{ color: "#3d5889" }}>
											Success Change Password
										</h2>
										<img
											src={ImageSucces}
											alt=""
											className="card-image"
										/>
									</div>
								</>
							) : (
								<>
									{currentTab === 0 ? (
										<>
											<div className="profile_atas">
												<img
													src={Profile}
													alt="profile_icons"
												/>
											</div>
											<div className="kotak-profile">
												<div className="profile-key">
													<div className="profile-title">
														Full Name
													</div>
													<div className="profile-title">
														Email{" "}
													</div>
													<div className="profile-title">
														Address
													</div>
													<div className="profile-title">
														Office City
													</div>
													<div className="profile-title">
														Position
													</div>
												</div>
												<div className="profile-value">
													<div className="profile-name">
														: {DataUser.fullName}
													</div>
													<div className="profile-email">
														: {DataUser.email}
													</div>
													<div className="profile-address">
														: {DataUser.address}
													</div>
													<div className="profile-office-city">
														: {DataUser.officeCity}
													</div>
													<div className="profile-position">
														: {DataUser.position}
													</div>
												</div>
											</div>
										</>
									) : currentTab === 1 ? (
										<>
											<div className="custom-container">
												<form
													onSubmit={
														handleSubmitChangePassword
													}
													className="custom-form"
													autoComplete="off"
												>
													<h2 className="custom-heading">
														Change Password
													</h2>
													<div className="custom-input-container">
														<label
															htmlFor="oldPassword"
															className="custom-label"
														>
															Old Password
														</label>
														<div className="old-pasword">
															<input
																type={
																	!showOldPassword
																		? "text"
																		: "password"
																}
																name="oldPassword"
																id="oldPassword"
																placeholder="Enter Old Password"
																onChange={
																	handleOldPasswordChange
																}
																className="custom-input"
															/>
															{showOldPassword ? (
																<IoEyeOffOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowOldPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															) : (
																<IoEyeOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowOldPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															)}
														</div>

														{oldPasswordWarning && (
															<p
																style={{
																	color: "red",
																	textAlign:
																		"start",
																	marginTop:
																		"0.5rem",
																	marginBottom:
																		"-0.5rem",
																}}
															>
																Old password
																must not be
																empty
															</p>
														)}
														<label
															htmlFor="newPassword"
															className="custom-label"
														>
															New Password
														</label>
														<div className="old-pasword">
															<input
																type={
																	!showNewPassword
																		? "text"
																		: "password"
																}
																name="newPassword"
																id="newPassword"
																placeholder="Enter New Password"
																onChange={
																	handleNewPasswordChange
																}
																className="custom-input"
															/>
															{showNewPassword ? (
																<IoEyeOffOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowNewPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															) : (
																<IoEyeOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowNewPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															)}
														</div>
														{newPasswordWarning && (
															<p
																style={{
																	color: "red",
																	textAlign:
																		"start",
																	marginTop:
																		"0.5rem",
																	marginBottom:
																		"-0.5rem",
																}}
															>
																New password
																must not be
																empty
															</p>
														)}
														<label
															htmlFor="confirmPassword"
															className="custom-label"
														>
															Confirm Password
														</label>
														<div className="old-pasword">
															<input
																type={
																	!showConfirmPassword
																		? "text"
																		: "password"
																}
																name="confirmPassword"
																id="confirmPassword"
																placeholder="Enter Confirm Password"
																onChange={
																	handleConfirmPasswordChange
																}
																className="custom-input"
															/>
															{showConfirmPassword ? (
																<IoEyeOffOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowConfirmPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															) : (
																<IoEyeOutline
																	size={25}
																	color="black"
																	onClick={
																		handleShowConfirmPassword
																	}
																	style={{
																		cursor: "pointer",
																		marginLeft:
																			"-2rem",
																	}}
																/>
															)}
														</div>
														{confirmPasswordWarning && (
															<p
																style={{
																	color: "red",
																	textAlign:
																		"start",
																	marginTop:
																		"0.5rem",
																	marginBottom:
																		"-0.5rem",
																}}
															>
																Confirm password
																must not be
																empty
															</p>
														)}
													</div>
													<div className="custom-button-container">
														<button
															style={{
																width: "30%",
															}}
															type="submit"
															className="custom-button"
														>
															<p className="custom-button-text">
																Save
															</p>
														</button>
													</div>
												</form>
											</div>
										</>
									) : currentTab === 2 ? (
										<>
											<form
												className="full-width-form"
												onSubmit={handleSubmit}
												style={{
													width: "120vh",
												}}
											>
												<div className="form-group">
													<div className="wrapper-form">
														<div className="wrapper-input">
															<label htmlFor="ip_server_pc">
																IP Server PC
															</label>
														</div>
														<input
															type="text"
															name="ipServerPC"
															id="ipServerPC"
															className={
																newWifiResults
																	? "disabled-input"
																	: ""
															}
															value={
																newWifiResults
															}
															readOnly
														/>
													</div>
												</div>

												<div className="form-group">
													<div className="wrapper-form">
														<div className="wrapper-input">
															<label htmlFor="ip_server_camera">
																IP Server Camera
															</label>
														</div>
														<input
															type="text"
															name="ipServerCamera"
															id="ipServerCamera"
															className="disabled-input"
															onChange={(e) =>
																setIpCamera(
																	e.target
																		.value
																)
															}
															value={ipCamera}
														/>
													</div>
												</div>
												<div className="form-group">
													<div className="wrapper-form">
														<div className="wrapper-input">
															<label htmlFor="status_card_reader">
																Status Card
																Reader
															</label>
														</div>
														<input
															type="text"
															name="statusCardReader"
															id="statusCardReader"
															className="disabled-input"
															readOnly
															// onChange={(e) => setStatusCardReader(e.target.value)}
															value={
																statusCardReader
															}
														/>
													</div>
												</div>

												<div className="form-group">
													<div className="wrapper-form">
														<div className="wrapper-input">
															<label htmlFor="status_camera">
																Status Camera
															</label>
														</div>
														<input
															type="text"
															name="statusCamera"
															id="statusCamera"
															className="disabled-input"
															onChange={(e) =>
																setStatusCamera(
																	e.target
																		.value
																)
															}
															value={statusCamera}
															readOnly
														/>
													</div>
												</div>
												<button
													className="ok-button"
													style={{ width: "100%" }}
												>
													Save
												</button>
											</form>
										</>
									) : currentTab === 3 ? (
										<>
											<div
												style={{
													backgroundColor: "white",
													width: "130vh",
													height: "70vh",
													borderRadius: "3%",
												}}
											>
												<h1
													className="card-title"
													style={{ paddingTop: "5%" }}
												>
													Test Camera Configuration
												</h1>
												{streamKamera ? (
													<>
														<div
															style={{
																height: "280px",
																display: "flex",
																alignItems:
																	"center",
																justifyContent:
																	"center",
															}}
														>
															{/* {
																<p>
																	ini adalah{" "}
																	{urlKamera}
																</p>
															} */}
															<VideoPlayer
																url={urlKamera}
															/>
															{/* <ReactPlayer
																className="react-player"
																url={urlKamera}
																width="100%"
																height="100%"
																playing={true}
															/> */}
														</div>
														<div>
															<button
																className="ok-button"
																style={{
																	marginLeft:
																		"29%",
																	marginBottom:
																		"5%",
																}}
																onClick={
																	handleTakePhoto
																}
															>
																Take a face
																Image
															</button>
														</div>
													</>
												) : loading ? (
													<>
														<div
															className="loading-container"
															style={{
																padding: "15%",
																display: "flex",
																justifyContent:
																	"center",
															}}
														>
															<h2
																style={{
																	color: "#3d5889",
																}}
															>
																Please Wait...
															</h2>
														</div>
													</>
												) : (
													<>
														<div
															style={{
																height: "280px",
																display: "flex",
																alignItems:
																	"center",
																justifyContent:
																	"center",
															}}
														>
															{succesCapture ? (
																<>
																	<img
																		src={
																			capturedImageTest
																		}
																		alt="wajah"
																		style={{
																			width: "20%",
																		}}
																	/>
																</>
															) : (
																<>
																	<img
																		src={
																			Face
																		}
																		alt="wajah"
																		style={{
																			width: "30%",
																		}}
																	/>
																</>
															)}
														</div>
														<button
															className="ok-button"
															style={{
																marginLeft:
																	"29%",
																marginBottom:
																	"5%",
															}}
															onClick={
																startStream
															}
														>
															Start Stream Camera
														</button>
													</>
												)}
											</div>
										</>
									) : (
										<>
											<h1>Test Printer Configuration</h1>
											<h2>Please Wait...</h2>
										</>
									)}
								</>
							)}
						</div>
					</div>

					<div className="configuration-kanan">
						<div className="configuration-atas-kanan">
							<ul className="configuration-list">
								{listConfiguration.map((list, index) => (
									<li
										className={`configuration-list-item ${currentTab === index
											? "isActived"
											: ""
											}`}
										onClick={() => setCurrentTab(index)}
									>
										<div className="number-style">
											{/* <img src={listIcons[index]} alt={`${list}_icons`} /> */}
											<list.icon
												size={45}
												color="black"
											/>
										</div>
										<div className="list-style">
											{list?.name}
										</div>
									</li>
								))}
							</ul>
						</div>
						<div
							className="configuration-bawah-kanan"
							onClick={handleBackToApply}
						>
							<img src={BackIcons} alt="back_icons" />
							Back to Home
						</div>
					</div>
				</div>
			</div>
			<Printer
				dataNumberPermohonanPropsVisa="Z1A012002"
				dataNumberPermohonanPropsReceipt="XA0188090"
				printRefProps={printRef}
				dataPrice="500.000"
				dataLokasi="TEST"
				passportumber="A0B0C0D001"
				passportName="Udin Samsul Arifin"
				passportUrl="https://www.google.com"
			/>
		</div>
	);
};

export default Information;
