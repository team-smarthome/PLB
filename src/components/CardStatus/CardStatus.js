import React, { useContext, useEffect, useRef, useState } from "react";
import "./CardStatusStyle.css";
import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";
import Face from "../../assets/images/face2.svg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dataKodePos from "../../utils/dataKodePos";
import Select from "react-select";
import io from "socket.io-client";
import { Toast } from "../Toast/Toast";
import ReactPlayer from "react-player";
import DataContext from "../../context/DataContext";
import axios from "axios";
import { url_dev } from "../../services/env";
import dataNegara from "../../utils/dataNegara";
import { apiVoaPayment } from "../../services/api";
import VideoPlayer from "../VideoPlayer";
import dataPasporImg from "../../utils/dataPhotoPaspor";

const parse = require("mrz").parse;

const CardStatus = ({ statusCardBox, sendDataToInput, sendDataToParent2 }) => {
	const { data } = useContext(DataContext);
	const [capturedImage, setCapturedImage] = useState(null);
	const [email, setEmail] = useState(null);
	const [emailConfirmation, setEmailConfirmation] = useState(null);
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [isValidEmailConfirmation, setIsValidEmailConfirmation] =
		useState(true);
	const [emailConfirmWarning, setEmailConfirmWarning] = useState(false);
	const [postalCodeWarning, setPostalCodeWarning] = useState(false);
	const [emailWarning, setEmailWarning] = useState(false);
	const [NumberWarning, setNumberWarning] = useState(false);
	const [titleWarning, setTitleWarning] = useState("");
	const navigate = useNavigate();
	const [selectedKabupaten, setSelectedKabupaten] = useState(null);
	const [kodePos, setKodePos] = useState("");
	const [kotaUser, setKotaUser] = useState("");
	const [optionNegara, setOptionNegara] = useState(null);
	const [codeOfState, setCodeOfState] = useState("");

	const [inputValue, setInputValue] = useState("");
	const [mrz, setMrz] = useState(["", ""]);
	const [statusSearch, setStatusSearch] = useState(false);
	const kabupatenOptions = dataKodePos.data.map((item) => ({
		value: item.kabupaten,
		label: item.kabupaten,
	}));

	const NegaraOptions = dataNegara.data.map((item) => ({
		value: item.id_negara,
		label: item.deskripsi_negara,
	}));

	const [urlKamera, setUrlKamera] = useState("");

	const [streamKamera, setStreamKamera] = useState(false);

	const [numberPassport, setNumberPassport] = useState(null);
	const [codeState, setCodeState] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	const socket_IO_4000 = io("http://localhost:4000");

	const checkAndHandleTokenExpiration = () => {
		const jwtToken = localStorage.getItem("JwtToken");
		if (!jwtToken) {
			return false;
		}

		const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
		const expirationTime = decodedToken.exp * 1000;
		const now = Date.now();
		const isExpired = now > expirationTime;

		return !isExpired;
	};

	// Contoh penggunaan di tempat lain
	const handleTokenExpiration = () => {
		// const isTokenValid = checkAndHandleTokenExpiration();

		// if (!isTokenValid) {
		// 	// Token has expired, handle the expiration here
		// 	Swal.fire({
		// 		icon: "error",
		// 		text: "Expired JWT Token",
		// 		confirmButtonColor: "#3d5889",
		// 	}).then((result) => {
		// 		if (result.isConfirmed) {
		// 			// navigate("/");
		// 			localStorage.removeItem("user");
		// 			localStorage.removeItem("JwtToken");
		// 			localStorage.removeItem("cardNumberPetugas");
		// 			localStorage.removeItem("key");
		// 			localStorage.removeItem("token");
		// 			localStorage.removeItem("jenisDeviceId");
		// 			localStorage.removeItem("deviceId");
		// 			localStorage.removeItem("airportId");
		// 			localStorage.removeItem("price");
		// 		}
		// 	});
		// }
	};

	const handleTakePhoto = async () => {
		console.log("masuktakephoto");
		console.log("dataPasporImg", dataPasporImg?.visibleImage);
		// socket_IO_4000.emit("take_photo");
		setCapturedImage(`data:image/jpeg;base64,${dataPasporImg?.visibleImage}`);
		sendDataToInput({
			statusCardBox: "takePhotoSucces",
			capturedImage: `data:image/jpeg;base64,${dataPasporImg?.visibleImage}`,
			emailUser: email,
			titleHeader: "Apply PLB",
			titleFooter: "Next Step",
		});

		// socket_IO_4000.emit("stop_stream");
	};

	const handleReloadPhoto = () => {
		// socket_IO_4000.emit("start_stream");
		// socket_IO_4000.emit("reload_photo");
		sendDataToInput({
			statusCardBox: "lookCamera",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Apply PLB",
			titleFooter: "Next Step",
		});
	};

	useEffect(() => {
		socket_IO_4000.on("stream_camera", (stream_url) => {
			setUrlKamera(stream_url);
			setStreamKamera(true);
			console.log("masuksiniKAMERASTREAM");
			console.log("urkamera", urlKamera);
		});
		socket_IO_4000.on("photo_taken", (imageBase64) => {
			console.log("Image_path_received: ", imageBase64);
			setCapturedImage(imageBase64);
			sendDataToInput({
				statusCardBox: "takePhotoSucces",
				capturedImage: imageBase64,
				emailUser: email,
				titleHeader: "Apply PLB",
				titleFooter: "Next Step",
			});
		});
		socket_IO_4000.on("error_photo", (error) => {
			console.error("Error taking photo:", error);
			sendDataToInput({
				statusCardBox: "lookCamera",
				capturedImage: null,
				emailUser: email,
				titleHeader: "Apply PLB",
				titleFooter: "Next Step",
			});
		});
	}, [socket_IO_4000]);

	const doRetake = () => {
		// socket_IO_4000.emit("start_stream");
		sendDataToInput({
			statusCardBox: "lookCamera",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Apply PLB",
			titleFooter: "Next Step",
		});
	};

	const handleEmailChange = (event) => {
		// console.log("Email Input Change:", event.target.value);
		setEmail(event.target.value);
		setEmailWarning(false);
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		setIsValidEmail(emailRegex.test(event.target.value));
	};

	const handleEmailConfirmationChange = (event) => {
		// console.log("Email Confirmation Input Change:", event.target.value);
		setEmailConfirmation(event.target.value);
		setEmailConfirmWarning(false);
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		setIsValidEmailConfirmation(emailRegex.test(event.target.value));
	};

	const handleNumberPassportChange = (event) => {
		// setNumberPassport(event.target.value);
		setNumberPassport(event.target.value.toUpperCase());
	};

	const handleOkButtonClick = () => {
		if (!email) {
			setTitleWarning("Please enter your email address!");
			setEmailWarning(true);
			return;
		} else if (!emailConfirmation) {
			setTitleWarning("Please enter your email address confirmation!");
			setEmailConfirmWarning(true);
			return;
		} else if (email !== emailConfirmation) {
			setTitleWarning("Email confirmation not match!");
			setEmailConfirmWarning(true);
			return;
		} else if (!isValidEmail) {
			setTitleWarning("Please enter a valid email address!");
			setEmailWarning(true);
			return;
		} else if (!isValidEmailConfirmation) {
			setTitleWarning("Please enter a valid email address confirmation!");
			setEmailConfirmWarning(true);
			return;
		} else {
			sendDataToInput({
				statusCardBox: "emailSucces",
				emailUser: email,
				capturedImage: capturedImage,
				titleHeader: "Apply PLB",
				titleFooter: "Next Step",
			});
		}
	};

	const handleSearchPassport = async () => {
		if (!numberPassport) {
			setNumberWarning(true);
		} else {
			const token = localStorage.getItem("token");
			const key = localStorage.getItem("key");
			const bearerToken = localStorage.getItem("JwtToken");
			const header = {
				Authorization: `Bearer ${bearerToken}`,
				"Content-Type": "application/json",
			};

			const bodyParam = {
				passportNumber: numberPassport.toUpperCase(),
				nationalityCode: optionNegara.value,
				token: token,
				key: key,
			};

			// console.log("bodyParamTest:", bodyParam);

			sendDataToInput({
				statusCardBox: "waiting",
				capturedImage: null,
				emailUser: null,
				titleHeader: "Apply PLB",
				titleFooter: "Next Step",
			});

			try {
				const res = await apiVoaPayment(header, bodyParam);
				// console.log("Response:", res);
				const data = res.data;
				// console.log("Data:", data);
				if (data.status === "Success" || data.status === "success") {
					sendDataToParent2(data.data);
				} else {
					sendDataToInput({
						statusCardBox: "notFoundPassport",
						emailUser: email,
						capturedImage: capturedImage,
						titleHeader: "Apply PLB",
						titleFooter: "Payment",
					});
					setTimeout(() => {
						sendDataToInput({
							statusCardBox: "searchPassport",
							capturedImage: null,
							emailUser: null,
							titleHeader: "Apply PLB",
							titleFooter: "Next Step",
						});
					}, 2000);
				}
			} catch (error) {
				// console.log("Error:", error);
				sendDataToInput({
					statusCardBox: "errorConnection",
					emailUser: email,
					capturedImage: capturedImage,
					titleHeader: "Apply PLB",
					titleFooter: "Payment",
				});
			}
		}
	};

	const handleKabupatenChange = (selectedOption) => {
		setSelectedKabupaten(selectedOption);
	};

	const handleCodeOfStateChange = (selectedOption) => {
		setOptionNegara(selectedOption);
	};

	const handleButtonClickPostalCode = () => {
		if (!selectedKabupaten) {
			setTitleWarning("Please select your city!");
			setPostalCodeWarning(true);
			return;
		} else {
			sendDataToInput({
				statusCardBox: "postalCodeSucces",
				emailUser: email,
				postalCode: kodePos,
				city: kotaUser,
				capturedImage: capturedImage,
				titleHeader: "Apply PLB",
				titleFooter: "Payment",
			});
		}
	};

	useEffect(() => {
		// Cari data kode pos berdasarkan kabupaten yang dipilih
		if (selectedKabupaten) {
			const selectedKabupatenData = dataKodePos.data.find(
				(item) => item.kabupaten === selectedKabupaten.value
			);

			if (selectedKabupatenData) {
				setKodePos(selectedKabupatenData.kode_pos);
				setKotaUser(selectedKabupatenData.kabupaten);
			}
		}
	}, [selectedKabupaten]);

	useEffect(() => {
		if (optionNegara) {
			const optionNegaraData = dataNegara.data.find(
				(item) => item.id_negara === optionNegaraData.value
			);

			if (optionNegaraData) {
				setCodeOfState(optionNegaraData.kode_pos);
			}
		}
	}, []);

	useEffect(() => {
		socket_IO_4000.on("connect", () => {
			console.log("BerhasilTerhuhungKeServer4000");
		});
	}, []);

	useEffect(() => {
		switch (statusCardBox) {
			case "iddle":
				socket_IO_4000.emit("stop_stream");
				break;
			case "inputEmail":
				console.log("masukKesiniHandleStreamKamera");
				socket_IO_4000.emit("start_stream");
				break;
			case "lookCamara":
				socket_IO_4000.on("stream_camera", (stream_url) => {
					setUrlKamera(stream_url);
					setStreamKamera(true);
					console.log("masuksiniKAMERASTREAM");
					console.log("data_url_stream", stream_url);
				});
				break;
			case "postalCode":
				socket_IO_4000.emit("stop_stream");
				// socket_IO_4000.emit("stop_stream");
				break;
			default:
				console.log(`Unknown status: ${statusCardBox}`);
		}
	}, [statusCardBox]);

	// useEffect(() => {}, [kodePos]);

	useEffect(() => {
		handleTokenExpiration();
	}, [
		capturedImage,
		doRetake,
		email,
		emailConfirmation,
		handleTokenExpiration,
	]);

	useEffect(() => {
		// console.log("capturedImage berubah:", capturedImage);
	}, [capturedImage]);

	const handleScanedArea = (event) => {
		let text = event.target.value.replace(/\s/g, "");
		// console.log("text: ", text);
		// console.log("text.length: ", text.length);
		if (text.length > 88) {
			text = text.substring(text.length - 88); // Ambil karakter ke-89 dan seterusnya
		}
		// mrz index ke 0 adalah 44 karakter pertama
		// mrz index ke 1 adalah 44 karakter kedua
		const mrzArray = [
			text.substring(0, 44),
			text.substring(44), // Sisanya diambil semua
		];
		setMrz(mrzArray);
		setInputValue(text);
		handleButtonClickScaned();
	};

	const [checksum, setCheckSum] = useState(false);

	const handleButtonClickScaned = () => {
		// console.log("inputValue: ", inputValue);
		if (mrz[0].length > 44 || mrz[1].length > 44) {
			setCheckSum(true);
		} else if (mrz[0].length === 0 || mrz[1].length === 0) {
			setCheckSum(true);
		}
		try {
			const mrzParsed = parse(mrz);
			// console.log("mrz: ", mrzParsed.fields);
			sendDataToParent2(mrzParsed.fields);
			setCheckSum(false);
		} catch (error) {
			console.log(error.message);
		}
	};

	const renderCardContent = () => {
		switch (statusCardBox) {
			case "inputEmail":
				return (
					<>
						<h1 className="card-title">
							Please Input Your Email Address
						</h1>
						<p>VOA will be sent to your email.</p>
						<div className="input-email">
							<input
								type="text"
								name="email"
								placeholder="Email"
								value={email}
								onChange={handleEmailChange}
							/>
						</div>
						{emailWarning && (
							<div className="warning">{titleWarning}</div>
						)}
						<div className="input-email">
							<input
								style={{ marginTop: "5%" }}
								type="text"
								name="email-confirmation"
								placeholder="Email Confirmation"
								value={emailConfirmation}
								onChange={handleEmailConfirmationChange}
							/>
						</div>
						{emailConfirmWarning && (
							<div className="warning">{titleWarning}</div>
						)}
						<button
							type="button"
							className="ok-button"
							onClick={handleOkButtonClick}
						>
							OK
						</button>
					</>
				);

			case "searchPassport":
				return (
					<>
						<h1 className="card-title py-4">
							Search Passport Number
						</h1>

						<div className="input-email py-4">
							<input
								type="text"
								name="number-passport"
								placeholder="Passport Number"
								value={numberPassport}
								onChange={handleNumberPassportChange}
							/>
						</div>
						{NumberWarning && (
							<div className="warning">
								passport number cannot be empty
							</div>
						)}
						<div
							className="input-postal-code"
							style={{ marginTop: "5%" }}
						>
							<Select
								value={optionNegara}
								onChange={handleCodeOfStateChange}
								options={NegaraOptions}
								placeholder="Select Nationality"
								className="basic-single"
								classNamePrefix="select"
								styles={{
									container: (provided) => ({
										...provided,
										flex: 1,
										width: "50vh",
										maxHeight: "30px",
										borderRadius: "500px",
										backgroundColor:
											"rgba(217, 217, 217, 0.75)",
										fontFamily: "Roboto, Arial, sans-serif",

										marginBottom: "15%",
									}),
									valueContainer: (provided) => ({
										...provided,
										flex: 1,
										width: "100%",
									}),
									control: (provided) => ({
										...provided,
										flex: 1,
										width: "100%",
									}),
								}}
							/>
						</div>

						{emailConfirmWarning && (
							<div className="warning">
								Please enter your code of state!
							</div>
						)}
						<button
							type="button"
							className="ok-button"
							onClick={handleSearchPassport}
						>
							OK
						</button>
					</>
				);

			case "postalCode":
				return (
					<>
						<h1
							className="card-title"
							style={{
								marginBottom: "8%",
							}}
						>
							Please Input Your City
						</h1>
						<div className="input-postal-code">
							<Select
								value={selectedKabupaten}
								onChange={handleKabupatenChange}
								options={kabupatenOptions}
								className="basic-single"
								classNamePrefix="select"
								styles={{
									container: (provided) => ({
										...provided,
										flex: 1,
										width: "315px",
										maxHeight: "30px",
										borderRadius: "500px",
										backgroundColor:
											"rgba(217, 217, 217, 0.75)",
										fontFamily: "Roboto, Arial, sans-serif",

										marginBottom: "15%",
									}),
									valueContainer: (provided) => ({
										...provided,
										flex: 1,
										width: "100%",
									}),
									control: (provided) => ({
										...provided,
										flex: 1,
										width: "100%",
									}),
								}}
							/>
						</div>
						<div
							className="input-email"
							style={{ marginBottom: "4%" }}
						>
							<input
								type="text"
								name="postal-code"
								placeholder="Postal Code"
								value={kodePos}
								readOnly
								disabled
							/>
						</div>
						{postalCodeWarning && (
							<div className="warning">{titleWarning}</div>
						)}
						<button
							type="button"
							className="ok-button"
							onClick={handleButtonClickPostalCode}
						>
							OK
						</button>
					</>
				);

			case "checkData":
				return (
					<>
						<h1 className="card-title check-data-title">
							Please Check Your Passport Data
						</h1>
						<p>Tap on checkbox if true.</p>
						<p>Tap on edit icon if you want to correct the data.</p>
						<img src={Gambar4} alt="" className="card-image" />
					</>
				);

			case "waiting":
				return (
					<>
						<h1 className="card-title check-data-title">
							Please wait...
						</h1>
					</>
				);
			case "waiting2":
				return (
					<>
						<h1 className="card-title check-data-title">
							Please wait...
						</h1>
						<button
							className="ok-button"
							onClick={handleReloadPhoto}
						>
							Reload Camera
						</button>
					</>
				);
			case "notFoundPassport":
				return (
					<>
						<h1 className="card-title">Application Not Found</h1>
						<img src={Gambar3} alt="" className="card-image" />
					</>
				);

			case "lookCamera":
				return (
					<>
						<h1 className="card-title">
							Please look at the camera
						</h1>
						<div style={{ height: "180px" }}>
							{/* <p>ini adalah {urlKamera}</p> */}
							<VideoPlayer url={`http://localhost:8080/stream.m3u8`} />
							{/* {streamKamera ? (
                <ReactPlayer
                  className="react-player"
                  url="http://localhost:4000/192.168.30.170_.m3u8"
                  width="100%"
                  height="100%"
                  playing={true}
                />
              ) : (
                <h1 className="card-title2 check-data-title">Please wait...</h1>
              )} */}
						</div >
						<button className="ok-button" onClick={handleTakePhoto}>
							Take a face photo
						</button>
					</>
				);

			case "takePhotoSucces":
				return (
					<>
						{capturedImage && (
							<div className="container-box-image">
								<h1 className="card-title">
									Take Photo Success
								</h1>

								<div className="box-image">
									<img
										style={{
											width: "100vh",
											height: "30vh",
										}}
										src={capturedImage}
										alt="Captured Image"
										className="potrait-image"
									/>
								</div>
								<button
									onClick={doRetake}
									className="retake-button"
								>
									Retake
								</button>
							</div>
						)}
					</>
				);
			case "emailSucces":
				const imageSource = getImageSource();
				return (
					<>
						<h1 className="card-title">
							{getStatusHeaderText().map((text, index) => (
								<React.Fragment key={index}>
									{text}
									<br />
								</React.Fragment>
							))}
						</h1>
						<img src={imageSource} alt="" className="card-image" />
					</>
				);
			case "searchPassportSucces":
				return (
					<>
						<h1 className="card-title">
							{getStatusHeaderText().map((text, index) => (
								<React.Fragment key={index}>
									{text}
									<br />
								</React.Fragment>
							))}
						</h1>
						<img src={Gambar2} alt="" className="card-image" />
					</>
				);
			case "postalCodeSucces":
				return (
					<>
						<h1 className="card-title">
							{getStatusHeaderText().map((text, index) => (
								<React.Fragment key={index}>
									{text}
									<br />
								</React.Fragment>
							))}
						</h1>
						<img src={Gambar2} alt="" className="card-image" />
					</>
				);
			case "successSearch":
				return (
					<>
						<>
							<h1 className="card-title">
								<React.Fragment>
									Success Get Passport Data
									<br />
								</React.Fragment>
							</h1>
							<img src={Gambar2} alt="" className="card-image" />
						</>
					</>
				);
			case "success":
				return (
					<>
						<>
							<h1 className="card-title">
								{getStatusHeaderText().map((text, index) => (
									<React.Fragment key={index}>
										{text}
										<br />
									</React.Fragment>
								))}
							</h1>
							<img src={Gambar2} alt="" className="card-image" />
						</>
					</>
				);

			default:
				return (
					<>
						<h1 className="card-title">
							{getStatusHeaderText().map((text, index) => (
								<React.Fragment key={index}>
									{text}
									<br />
								</React.Fragment>
							))}
						</h1>
						<textarea
							className="areaScan"
							autoFocus
							onChange={handleScanedArea}
							value={inputValue}
						></textarea>
					</>
				);
		}
	};

	const getImageSource = () => {
		switch (statusCardBox) {
			case "success":
				return Gambar2;
			case "errorchecksum":
			case "errorVoa":
			case "errorBulan":
			case "errorDanger":
			case "errorIntal":
			case "inputEmail":
			case "photoNotMatch":
			case "errorWebsocket":
			case "notFoundPassport":
				return Gambar3;
			case "lookCamera":
				return Gambar6;
			case "takePhotoSucces":
				return Gambar7;
			case "emailSucces":
			case "postalCodeSucces":
				return Gambar2;
			case "errorConnection":
				return Gambar1;
			case "notconnectCamera":
				return Gambar1;
			default:
				return Gambar1;
		}
	};

	const getStatusHeaderText = () => {
		switch (statusCardBox) {
			case "iddle":
				return ["Scan your PLB passport"];
			case "success":
				return ["Passport has successfully", "scanned"];
			case "errorchecksum":
				return [
					"Passport has not successfully",
					"scanned. Please rescan",
				];
			case "errorVoa":
				return ["Your Country is not eligible", "for Apply PLB"];
			case "errorBulan":
				return ["Your passport expires in less", "than 6 months"];
			case "errorDanger":
				return ["Your passport is from danger country", ""];
			case "errorIntal":
				return ["Your passport already has an active stay permit.", ""];
			case "inputEmail":
				return [
					"Please Input Your Email Address",
					"VOA will be sent to email",
				];
			case "emailSucces":
				return ["Email Successfully Saved"];
			case "postalCodeSucces":
				return ["Postal Code Successfully Saved"];
			case "photoNotMatch":
				return ["Face Paspor and", "photo not Match"];
			case "errorConnection":
				return ["Connecting Device", "Please wait..."];
			case "errorWebsocket":
				return ["Error Connecting Device", "Device connection failed"];
			case "notconnectCamera":
				return [
					"Device Camera is not connected",
					"Please check the device",
				];
			case "searchPassportSucces":
				return ["Passport Data Successfully Found"];
			case "notFoundPassport":
				return ["Application Not Found"];
			default:
				return [];
		}
	};

	return (
		<div className="card-status">
			<div className="card-container">
				<div className="inner-card">{renderCardContent()}</div>
			</div>
		</div>
	);
};

export default CardStatus;
