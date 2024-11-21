import React, { useContext, useEffect, useRef, useState } from "react";
import "./CardStatusStyle.css";
import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";
import { useNavigate } from "react-router-dom";
import dataKodePos from "../../utils/dataKodePos";
import Select from "react-select";
import io from "socket.io-client";
import DataContext from "../../context/DataContext";
import dataNegara from "../../utils/dataNegara";
import { apiVoaPayment } from "../../services/api";
import VideoPlayer from "../VideoPlayer";
import { useAtom } from "jotai";
import { imageToSend, resultDataScan, caputedImageAfter, ImageDocumentPLB, DataHasilCekal } from "../../utils/atomStates";
import { initiateSocket, addPendingRequest } from "../../utils/socket";
import { FaRegIdCard } from "react-icons/fa";
import ImgsViewer from "react-images-viewer";
import Modals from "../Modal/Modal";
import ModalCekal from "../Modal/ModalCekal";

const CardStatus = ({ statusCardBox, sendDataToInput, sendDataToParent2, dataScanProps }) => {
	const [image, setImage] = useAtom(imageToSend);
	const [dataCekalAtom] = useAtom(DataHasilCekal);
	const [skorKemiripan, setSkorKemiripan] = useState(0);
	const [documentResult, setDocumentResult] = useState([])
	const canvasRef = useRef(null);
	const [documentPLBImage, setDocumentPLBImage] = useAtom(ImageDocumentPLB)
	const [capturedImageAfter2, setCapturedImageAfter2] = useAtom(caputedImageAfter);
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
	const kabupatenOptions = dataKodePos.data.map((item) => ({
		value: item.kabupaten,
		label: item.kabupaten,
	}));
	const [resDataScan, setResDataScan] = useAtom(resultDataScan)
	// console.log(resDataScan, "resDataScan")
	const NegaraOptions = dataNegara.data.map((item) => ({
		value: item.id_negara,
		label: item.deskripsi_negara,
	}));

	const [numberPassport, setNumberPassport] = useState(null);

	const [isOpenImage, setIsOpenImage] = useState(false)
	const [resultArray, setResultArray] = useState([])
	const [openModakCekal, setOpenModalCekal] = useState(false)

	const handlePreviewImage = (image) => {
		setIsOpenImage(true)
		setResultArray([{
			src: image
		}])
	}
	const socket_IO_4000 = initiateSocket();

	useEffect(() => {
		socket_IO_4000.once("photo_taken", (imageBase64) => {
			setCapturedImageAfter2(imageBase64);
			console.log("base64sdasdas", imageBase64)
			setCapturedImage(imageBase64);
			sendDataToInput({
				statusCardBox: "takePhotoSucces",
				capturedImage: imageBase64,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
			});
		});
		socket_IO_4000.on("error_photo", (error) => {
			console.log('error_photo', error)
			const statusCardBoxMap = {
				cannot_take_photo: 'errorPhoto',
				closed_eyes: "closedEyes",
				glasses: "usingGlasses",
				hat: "usingHat",
				mask: "usingMask",
				glassesMask: 'usingMaskGlasses',
				occlusion: 'occlusionImage'
			};

			const statusCardBoxRes = statusCardBoxMap[error] || "lookCamera";
			sendDataToInput({
				statusCardBox: statusCardBoxRes,
				capturedImage: null,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Next Step"
			});
			setTimeout(() => {
				sendDataToInput({
					statusCardBox: "lookCamera",
					capturedImage: null,
					emailUser: null,
					titleHeader: "Registrasi Pas Lintas Batas",
					titleFooter: "Next Step"
				});
			}, 2000);
		});
		
		socket_IO_4000.on("document-data", (data) => {
			if (data.image) {
				setDocumentResult(prevResult => {
					const updatedArray = [...prevResult, `data:image/jpeg;base64, ${data.image}`];
					console.log('After Update:', updatedArray);
					return updatedArray;
				  });
				// setDocumentPLBImage(data?.image)
				sendDataToInput({
					statusCardBox: 'getDocumentSucces',
					capturedImage: null,
					emailUser: null,
					titleHeader: "Registrasi Pas Lintas Batas",
					titleFooter: "Lanjut",
				});
			} else if (data.error) {
				sendDataToInput({
					statusCardBox: data?.error,
					capturedImage: null,
					emailUser: null,
					titleHeader: "Registrasi Pas Lintas Batas",
					titleFooter: "Lanjut",
				});
				setTimeout(() => {
					sendDataToInput({
						statusCardBox: 'iddle',
						capturedImage: null,
						emailUser: null,
						titleHeader: "Registrasi Pas Lintas Batas",
						titleFooter: "Lanjut",
					});
				}, 3000)
			} else {
				console.error("test12345", data);
			}
		});

		return () => {
			socket_IO_4000.off("photo_taken");
			socket_IO_4000.off("error_photo");
		}

	}, [socket_IO_4000, capturedImage]);

	useEffect(() => {
		console.log(documentResult, "documentResult")

	}, [documentResult])

	useEffect(() => {
		console.log(capturedImageAfter2, "asdasdasdsadsadsa")
		console.log(capturedImage, "adasdasdsadadsadassad")
	}, [CardStatus])


	useEffect(() => {
		setSkorKemiripan(dataCekalAtom?.skor_kemiripan || 0)
	}, [dataCekalAtom]);




	const handleTakePhoto = async () => {
		if (socket_IO_4000.connected) {
			console.log('testWebsocket Socket connected. Sending take_photo...');
			socket_IO_4000.emit("take_photo");
			sendDataToInput({
				statusCardBox: "waiting2",
				capturedImage: capturedImage,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
			});
		} else {
			sendDataToInput({
				statusCardBox: "errorWebsocket",
				capturedImage: null,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
			});
			addPendingRequest({ action: 'take_photo' });


			socket_IO_4000.connect();
		}
	};


	const handleGetDocumnet = async () => {
		console.log('testWebsocket Socket connected. Sending get_document...');
		if (socket_IO_4000.connected) {
			console.log('testWebsocket Socket connected. Sending get_document...');
			socket_IO_4000.emit("get-document");
			sendDataToInput({
				statusCardBox: "waiting3",
				capturedImage: capturedImage,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
			});
		} else {
			sendDataToInput({
				statusCardBox: "errorWebsocket",
				capturedImage: null,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
			});
			addPendingRequest({ action: 'get-documnent' });

			socket_IO_4000.connect();
		}
	};

	const handleReloadPhoto = () => {
		sendDataToInput({
			statusCardBox: "lookCamera",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Registrasi Pas Lintas Batas",
			titleFooter: "Lanjut",
		});
	};

	const handleReloadGetDocument = () => {
		sendDataToInput({
			statusCardBox: "iddle",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Registrasi Pas Lintas Batas",
			titleFooter: "Lanjut",
		});
	};




	const doRetake = () => {
		// socket_IO_4000.emit("start_stream");
		setCapturedImageAfter2(null);
		setCapturedImage(null);
		sendDataToInput({
			statusCardBox: "lookCamera",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Registrasi Pas Lintas Batas",
			titleFooter: "Lanjut",
		});
	};


	const doRetakeDocument = () => {
		// socket_IO_4000.emit("start_stream");
		setDocumentResult([])
		setDocumentPLBImage(null);
		sendDataToInput({
			statusCardBox: "iddle",
			capturedImage: null,
			emailUser: email,
			titleHeader: "Registrasi Pas Lintas Batas",
			titleFooter: "Lanjut",
		});
	};

	const doAddDocument = () => {
		// socket_IO_4000.emit("start_stream");
		// setDocumentPLBImage(null);
		// sendDataToInput({
		// 	statusCardBox: "iddle",
		// 	capturedImage: null,
		// 	emailUser: email,
		// 	titleHeader: "Registrasi Pas Lintas Batas",
		// 	titleFooter: "Lanjut",
		// });
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
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
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
				capturedImage: capturedImage,
				emailUser: null,
				titleHeader: "Registrasi Pas Lintas Batas",
				titleFooter: "Lanjut",
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
						titleHeader: "Registrasi Pas Lintas Batas",
						titleFooter: "Payment",
					});
					setTimeout(() => {
						sendDataToInput({
							statusCardBox: "searchPassport",
							capturedImage: capturedImage,
							emailUser: null,
							titleHeader: "Registrasi Pas Lintas Batas",
							titleFooter: "Lanjut",
						});
					}, 2000);
				}
			} catch (error) {
				// console.log("Error:", error);
				sendDataToInput({
					statusCardBox: "errorConnection",
					emailUser: email,
					capturedImage: capturedImage,
					titleHeader: "Registrasi Pas Lintas Batas",
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
				titleHeader: "Registrasi Pas Lintas Batas",
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

	// useEffect(() => {
	// 	socket_IO_4000.on("connect", () => {
	// 		console.log("BerhasilTerhuhungKeServer4000");
	// 	});
	// }, []);

	useEffect(() => {
		switch (statusCardBox) {
			case "iddle":
				socket_IO_4000.emit("stop_stream");
				break;
			case "inputEmail":
				console.log("masukKesiniHandleStreamKamera");
				socket_IO_4000.emit("start_stream");
				break;
			case "postalCode":
				socket_IO_4000.emit("stop_stream");
				break;
			default:
				console.log(`Unknown status: ${statusCardBox}`);
		}
	}, [statusCardBox]);


	const handleScanedArea = (event) => {
		let text = event.target.value.replace(/\s/g, "");
		if (text.length > 88) {
			text = text.substring(text.length - 88);
		}
		const mrzArray = [
			text.substring(0, 44),
			text.substring(44),
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
			// const mrzParsed = parse(mrz);
			// console.log("mrz: ", mrzParsed.fields);
			// sendDataToParent2(mrzParsed.fields);
			setCheckSum(false);
		} catch (error) {
			console.log(error.message);
		}
	};


	const combineImages = async () => {
		// console.log(documentResult)
		try {
		  if (!documentResult || documentResult.length === 0) {
			console.error("No documentResults provided.");
			return;
		  }
	
		  // Create Image objects for each Base64 string or URL
		  const imageObjects = documentResult.map((src) => {
			const img = new Image();
			img.src = src;
			return img;
		  });
	
		  // Wait for all images to load
		  const imageLoadPromises = imageObjects.map(
			(img) =>
			  new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
			  })
		  );
	
		  await Promise.all(imageLoadPromises);
	
		  // Combine images on the canvas
		  const canvas = canvasRef.current;
		  const ctx = canvas.getContext("2d");
	
		  // Calculate total canvas width and height
		  const totalWidth = imageObjects.reduce((sum, img) => sum + img.width, 0);
		  const maxHeight = Math.max(...imageObjects.map((img) => img.height));
	
		  canvas.width = totalWidth;
		  canvas.height = maxHeight;
	
		  // Draw each image sequentially
		  let xOffset = 0;
		  imageObjects.forEach((img) => {
			ctx.drawImage(img, xOffset, 0);
			xOffset += img.width; // Move to the right for the next image
		  });
	
		  // Export the combined image as a data URL
		  const dataURL = canvas.toDataURL("image/jpeg");
		  console.log(dataURL, "sini")
		  setDocumentPLBImage(dataURL);
		} catch (error) {
		  console.error("Error combining images:", error);
		}
	  };

	  useEffect(() => {
		combineImages()
	  }, [documentResult])
	  
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
							Silakan Periksa Data Anda
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
							Mohon Tunggu...
						</h1>
					</>
				);
			case "waiting2":
				return (
					<>
						<h1 className="card-title check-data-title">
							Mohon Tunggu...
						</h1>
						<button
							className="ok-button"
							onClick={handleReloadPhoto}
						>
							Muat Ulang
						</button>
					</>
				);
			case "waiting3":
				return (
					<>

						<div className="w-[70%]  flex justify-center flex-col items-center gap-10">
							<h1 className="card-title check-data-title">
								Mohon Tunggu...
							</h1>
							<button
								className="ok-button"
								onClick={handleReloadGetDocument}
							>
								Muat Ulang
							</button>
						</div>

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
							Mohon Lihat Kamera
						</h1>
						<div style={{ height: "180px" }}>
							<VideoPlayer url={'http://localhost:4001/stream_.m3u8'} />
						</div >
						<button className="ok-button" onClick={handleTakePhoto}>
							Ambil Foto
						</button>
					</>
				);
			case "usingMask":
			case "usingGlasses":
			case "errorPhoto":
			case "closedEyes":
			case "usingHat":
			case "usingMaskGlasses":
			case "occlusionImage":
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
						<img src={Gambar3} alt="" className="card-image" />
					</>
				);
			case "error_image":
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
						<img src={Gambar3} alt="" className="card-image" />
					</>
				);
			case "error_folder":
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
						<img src={Gambar3} alt="" className="card-image" />
					</>
				);
			case "takePhotoSucces":
				return (
					<>
						{(capturedImage || capturedImageAfter2) && (
							<div className="container-box-image">
								<h1 className="card-title">
									Berhasil Mengambil Foto
								</h1>

								<div className="box-image">
									<img
										style={{
											width: "100vh",
											height: "30vh",
										}}
										src={capturedImage ? capturedImage : capturedImageAfter2}
										alt="Captured Image"
										className="potrait-image"
									/>
								</div>
								<button
									onClick={doRetake}
									className="retake-button"
								>
									Ulangi
								</button>
							</div>
						)}
					</>
				);
			case "getDocumentSucces":
				return (
					<>
						{documentPLBImage && (
							<div className="container-box-image">
								<h1 className="card-title">
									Berhasil Mendapatkan Dokumen
								</h1>

								<div className="box-image cursor-pointer"
									onClick={() => handlePreviewImage(`${documentPLBImage}`)}
								>
									<img
										style={{
											minWidth: "500px",
											width: "100vh",
											height: "30vh",
										}}
										src={`${documentPLBImage ? documentPLBImage : ""}`}
										alt="Captured Image"
										className="potrait-image"
									/>
								</div>
								<div className="flex items-center justify-center gap-4">
								<button
									onClick={doRetakeDocument}
									className="retake-button"
								>
									Ulangi
								</button>
								{documentResult.length < 2 && (
									<button
									onClick={handleGetDocumnet}
									className="retake-button"
									style={{backgroundColor: "blue"}}
								>
									Tambah Lagi
								</button>
								)}
								</div>
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
			case "errorWebsocket":
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
						<img src={Gambar1} alt="" className="card-image" />
					</>
				);
			case 'kenaCekal':
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
						<button className="ok-button" onClick={() => setOpenModalCekal(true)} >
							Detail Cekal
						</button>
					</>
				);
			default:
				return (
					<>

						<div className="h-64 w-[80%]  flex flex-col justify-center items-center">
							<h1 className="card-title">
								Pindai Dokumen PLB
							</h1>
							<FaRegIdCard className="h-[80%] w-[80%]" />
						</div >
						<p className="text-black text-md mt-2">
							Silakan tunggu hingga proses pemindaian selesai, lalu klik tombol di bawah ini.
						</p>
						<button className="ok-button" onClick={handleGetDocumnet}>
							Dapatkan Dokumen
						</button>
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
			case 'usingMask':
			case 'usingGlasses':
			case 'errorPhoto':
			case 'closedEyes':
			case 'usingHat':
			case 'usingMaskGlasses':
			case 'occlusionImage':
			case 'error_image':
			case 'error_folder':
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
				return ["Scan Document PLB"];
			case "success":
				return ["Passport has successfully", "scanned"];
			case "errorchecksum":
				return [
					"Passport has not successfully",
					"scanned. Please rescan",
				];
			case "error_image":
				return ["Gambar Tidak Ditemukan", "Silahkan Coba Lagi"];
			case "error_folder":
				return ["Folder Tidak Ditemukan", "Harap Periksa Pengaturan"];
			case "closedEyes":
				return ["Gagal Ambil Foto", "Silahkan Coba Lagi"];
			case "usingMask":
				return ["Silahkan Lepas Masker", "Sebelum Foto"];
			case "usingGlasses":
				return ["Silahkan Lepas Kacamata", "Sebelum Foto"];
			case "errorPhoto":
				return ["Foto Tidak Valid", "Silahkan Coba Lagi"];
			case "usingHat":
				return ["Silahkan Lepas Topi", "Sebelum Foto"];
			case "usingMaskGlasses":
				return ["Silahkan Lepas Masker dan Kacamata", "Sebelum Foto"];
			case "occlusionImage":
				return ["Foto Tidak Valid", "Silahkan Coba Lagi"];
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
				return ["Kesalahan Menghubungkan Perangkat", "Gagal menghubungkan perangkat"];
			case "notconnectCamera":
				return [
					"Kamera Tidak Terhubung",
					"Silahkan Hubungkan Kamera",
				];
			case "searchPassportSucces":
				return ["Passport Data Successfully Found"];
			case "notFoundPassport":
				return ["Application Not Found"];
			case "kenaCekal":
				return ["Data Cekal Ditemukan", `Skor Kemiripan ${skorKemiripan}`];
			default:
				return [];
		}
	};

	return (
		<div className="card-status">
			<div className="card-container">
			<canvas ref={canvasRef} style={{ display: "none" }} />
				<div className="inner-card">{renderCardContent()}</div>
			</div>
			<ImgsViewer
				imgs={resultArray}
				isOpen={isOpenImage}
				onClose={() => { setIsOpenImage(false) }}
			/>

			<ModalCekal open={openModakCekal} onClose={() => { setOpenModalCekal(false) }} onTutup={null} row={dataCekalAtom} skorKemiripan={skorKemiripan} />
		</div>
	);
};

export default CardStatus;
