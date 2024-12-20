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
import ImageSucces from "../../assets/images/image-2.svg";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbNetwork } from "react-icons/tb";
import { IoCameraOutline, IoClose } from "react-icons/io5";
import { BsPrinter } from "react-icons/bs";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import VideoPlayer from "../../components/VideoPlayer";
import Cookies from 'js-cookie';
import Select from "react-select";
import Swal from "sweetalert2";
import { useAtom } from "jotai";
import { cookiesData, ipDataCamera } from "../../utils/atomStates";
import { initiateSocketConfig } from "../../utils/socket";
import { getDataPetugas } from "../../services/api";

const Information = () => {
	const socket2_IO_4000 = initiateSocketConfig();
	const [newWifiResults, setNewWifiResults] = useState("");
	const [oldPasswordWarning, setOldPasswordWarning] = useState(false);
	const [newPasswordWarning, setNewPasswordWarning] = useState(false);
	const [confirmPasswordWarning, setConfirmPasswordWarning] = useState(false);
	const [urlKamera, setUrlKamera] = useState("");
	const [streamKamera, setStreamKamera] = useState(false);
	const printRef = useRef();
	const navigate = useNavigate();
	const [isSucces, setIsSucces] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(true);
	const [showNewPassword, setShowNewPassword] = useState(true);
	const [showConfirmPassword, setShowConfirmPassword] = useState(true);
	const [loading, setLoading] = useState(false);
	const [capturedImageTest, setCapturedImageTest] = useState("");
	const [succesCapture, setSuccesCapture] = useState(false);
	const [data, setData] = useState([]);
	const [totalCameras, setTotalCameras] = useState(0);
	const [selectedCamera, setSelectedCamera] = useState('');
	const [cameraIPs, setCameraIPs] = useState([]);
	const [loginData, setLoginData] = useState(false);
	const [loginDataArray1, setLoginDataArray1] = useState([]);
	const [dataIPCameranya, setDataIPCameranya] = useAtom(ipDataCamera);
	const [currentTab, setCurrentTab] = useState(0);
	const [isWaiting, setIsWaiting] = useState(false);
	const [isOpen, setIsOpen] = useState(false)
	const [dataUser, setDataUser] = useState({})
	const [ipCameraRegister, setIpCameraRegister] = useState([])
	const listConfiguration = [
		{
			name: "IP Config",
			icon: TbNetwork,
		},
		{
			name: "User",
			icon: FaRegUserCircle,
		},
		{
			name: "Change Password",
			icon: RiLockPasswordLine,
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

	const [dataPetugasRegister, setDataPetugasRegister] = useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();
		setIsWaiting(true);
		console.log("cameraIPsTotallength", cameraIPs.length);
		console.log("cameraIPsTotallength", cameraIPs);
		if (cameraIPs.length > 0) {
			setIsWaiting(true);
			const data = {
				ipServerCamera: cameraIPs,
			};
			if (socket2_IO_4000.connected) {
				socket2_IO_4000.emit("saveCameraData", data);
				socket2_IO_4000.on("saveDataCamera", (data) => {
					if (data === "successfully") {
						setIsWaiting(false);
						Toast.fire({
							icon: "success",
							title: "Data berhasil disimpan",
						});
					} else {
						setIsWaiting(false);
						Toast.fire({
							icon: "error",
							title: "Ip Camera tidak terhubung",
						});
					}
				});
			} else {
				setIsWaiting(false);
				Toast.fire({
					icon: "error",
					title: "Gagal menyimpan data websocket tidak terhubung",
				});
			}

		} else {
			setIsWaiting(false);
			Toast.fire({
				icon: "error",
				title: "Please Insert IP Camera",
			});
		}
	};

	useEffect(() => {
		if (currentTab === 0) {
			if (newWifiResults) {
				const websocketUser = io(`http://${newWifiResults}:4010`)
				websocketUser.emit("startFilterUser")
				websocketUser.on("responseGetDataUserFilter", (data) => {
					setData(data);
					console.log("datayangdidapat", data);
				});

			} else {
			}
		}
	}, [currentTab]);

	const handleTakePhoto = async () => {
		console.log("handleTakenPhoto");
		setLoading(true);
		socket2_IO_4000.emit("take_photo");
	};

	const handleTotalCamerasChange = (selectedOption) => {
		if (selectedOption) {
			setTotalCameras(selectedOption.value);
		} else {
			setTotalCameras(0);
			setSelectedCamera('');
			setCameraIPs([]);
		}
	};

	const handleIPChange = (e, cameraIndex) => {
		const newCameraIPs = [...cameraIPs];
		newCameraIPs[cameraIndex] = e.target.value;
		setCameraIPs(newCameraIPs);
	};

	const cameraOptions = [...Array(totalCameras)].map((_, index) => ({
		value: `Kamera ${index + 1}`,
		label: `Kamera ${index + 1}`,
	}));

	const handleCameraSelect = (selectedOption) => {
		setSelectedCamera(selectedOption ? selectedOption.value : '');
	};



	const optionCameras = [...Array(10)].map((_, index) => ({
		value: index + 1,
		label: `${index + 1} Kamera`,
	}));

	const selectedCameraIndex = parseInt(selectedCamera.split(' ')[1], 10) - 1;

	useEffect(() => {
		const getUserdata = Cookies.get('userdata');
		if (!getUserdata) {
			navigate('/')
		}
		setDataUser(JSON.parse(getUserdata))
		console.log(JSON.parse(getUserdata), 'hasildaricookie')
	}, []);

	const DataUser = {
		nip: dataUser?.nip,
		fullName: dataUser?.petugas?.nama_petugas,
		jabatan: dataUser?.jabatan?.nama_jabatan,
	};

	useEffect(() => {
		socket2_IO_4000.emit("DataIPCamera");
		return () => {
			socket2_IO_4000.off("DataIPCamera");
		}
	}, []);

	useEffect(() => {
		socket2_IO_4000.on("ResponseDataIPCamera", (data) => {
			if (data.ipCamera.length > 0) {
				if (data.status === "connected") {
					setCameraIPs([data.ipCamera]);
					console.log("dataUserKameraSetting", data);
				} else {
					setLoading(false)
					Toast.fire({
						icon: "error",
						title: "Cannot connect to camera"
					});
				}
			} else {
				setLoading(false)
				Toast.fire({
					icon: "error",
					title: "Cannot connect to camera"
				});
			}
		});

		socket2_IO_4000.on("photo_taken", (imageBase64) => {
			setLoading(false);
			setStreamKamera(false);
			setSuccesCapture(true);
			console.log("imagebase64", imageBase64);
			setCapturedImageTest(imageBase64);
			console.log("Image_path_received: ", imageBase64);
			socket2_IO_4000.emit("stop_stream");
		});



		return () => {
			socket2_IO_4000.off("photo_taken");
			socket2_IO_4000.off("ResponseDataIPCamera");

		}
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

	const startStream = () => {
		setLoading(true);
		const socketCamera = io("http://localhost:4001");
		socketCamera.on("stream_camera", (stream_url) => {
			setUrlKamera(stream_url);
		});
		socketCamera.emit("start_stream");
		setTimeout(() => {
			setLoading(false);
			setStreamKamera(true);
		}, 3000);
	};


	useEffect(() => {
		if (currentTab === 4) {
			handlePrint();
			setTimeout(() => {
				setCurrentTab(0);
			}, 2000);
		}
	}, [currentTab, handlePrint]);

	const openSideBar = () => {
		setIsOpen(true)
	}
	const closeSideBar = () => {
		setIsOpen(false)
	}

	console.log("loginDataArray1", loginDataArray1);
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
											<form
												className="full-width-form"
												onSubmit={handleSubmit}
												style={{
													width: "120vh",
												}}
											>
												<div className="wrapper-form">
													<div className="wrapper-input">
														<label htmlFor="ip_server_camera">
															IP Kamera Ambil Foto
														</label>
													</div>
													<input
														type="text"
														name="ipServerCamera"
														id="ipServerCamera"
														className={
															newWifiResults
																? ""
																: ""
														}
														value={
															cameraIPs
														}
														onChange={(e) =>
															setCameraIPs(
																[e.target
																	.value]
															)
														}
													/>
												</div>
												<button
													className="ok-button"
													style={{ width: "100%" }}
												>
													Save
												</button>
											</form>
										</>

									)
										: currentTab === 1 ? (
											<>
												<div className="profile_atas">
													<img src={Profile} alt="profile_icons" />
												</div>
												<div className="kotak-profile">
													<div className="profile-key">
														<div className="profile-title">Nip</div>
														<div className="profile-title">Nama</div>
														<div className="profile-title">Jabatan</div>
													</div>
													<div className="profile-value">
														<div className="profile-name">: {DataUser.nip}</div>
														<div className="profile-email">: {DataUser.fullName}</div>
														<div className="profile-office-city">
															: {DataUser.jabatan}
														</div>

													</div>
												</div>
											</>
										) : currentTab === 2 ? (
											<>
												<div className="custom-container">
													<form
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
																<VideoPlayer
																	url={urlKamera}
																/>
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
												<h1>Uji Coba Konfigurasi Printer</h1>
												<h2>Mohon Tunggu...</h2>
											</>
										)}
								</>
							)}
						</div>
					</div>

					<div className={isOpen ? "configuration-kanan-open" : "configuration-kanan"}>
						<div className="configuration-atas-kanan">
							<ul className="configuration-list">
								{isOpen ?
									<div className="configuration-header" onClick={closeSideBar}>
										<IoClose
											size={50}

										/>
									</div>
									:
									<div className="configuration-header" onClick={openSideBar}>
										<MdMenu
											size={50}

										/>
									</div>
								}
								{listConfiguration.map((list, index) => (
									<li
										className={`${isOpen ? "configuration-list-item-open" : "configuration-list-item"} ${currentTab === index
											? "isActived"
											: ""
											}`}
										onClick={() => setCurrentTab(index)}
									>
										<div className="number-style">
											<list.icon
												size={45}
												color="black"
											/>
										</div>
										{isOpen && <div className="list-style">
											{list?.name}
										</div>}
									</li>
								))}
							</ul>
						</div>
						<div
							className={isOpen ? "configuration-bawah-kanan-open" : "configuration-bawah-kanan"}
							onClick={handleBackToApply}
						>
							<img src={BackIcons} alt="back_icons" />
							{isOpen && <span>Back to Home</span>}
						</div>
					</div>
				</div>
			</div>
			<Printer
				printRefProps={printRef}
				passportumber="A0B0C0D001"
				passportName="Udin Samsul Prima"
				birthDate="31-12-2024"
				nationality="Indonesia"
			/>
		</div>
	);
};

export default Information;
