import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import haversine from "../functions/HaveRSine";

const Attendance = () => {
  const { isAuthenticated, user } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);
  const navigate = useNavigate();
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [allowLocation, setAllowLocation] = useState(false);
  const [branch, setBranch] = useState({ coordinates: null, radius: null });
  const [inputs, setInputs] = useState({
    punchInGeometry: null,
    punchOutGeometry: null,
    punchInPhoto: null,
    punchOutPhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(null); // 'punchIn' or 'punchOut'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user && user?.roleInfo) {
      console.log("User Role Info:", user.roleInfo);
      axios
        .post("/api/attendance/users/information/today", {
          userId: user._id,
          companyId: user.roleInfo.company,
          branchId: user.roleInfo.branch,
        })
        .then((res) => {
          console.log("Today's Attendance Data:", res.data);
          setHasPunchedIn(!res.data.lastPuchedOut);
        })
        .catch((err) => console.log("Error fetching attendance:", err));

      axios
        .get("/api/branch/info")
        .then((res) => {
          console.log("Branch Data:", res.data);
          setBranch({
            coordinates: res.data.coordinates,
            radius: res.data.radius,
          });
        })
        .catch((err) => console.log("Error fetching branch info:", err));
    }
    return () => {
      stopCamera(); // Stop camera on unmount
    };
  }, [user]);

  function startCamera() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // setShowCamera(true);
          console.log("Camera stream started:", stream);
          resolve(stream);
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please check permissions.");
          reject(err);
        });
    });
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");
        console.log(formData.get("image"));
        if (cameraMode === "punchIn") {
          setInputs((prev) => ({
            ...prev,
            punchInPhoto: formData.get("image"),
          }));
        } else if (cameraMode === "punchOut") {
          setInputs((prev) => ({
            ...prev,
            punchOutPhoto: formData.get("image"),
          }));
        }
      });
      setShowCamera(false);
    }
  }

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          let message = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get user location timed out.";
              break;
            default:
              message = "An unknown error occurred.";
              break;
          }
          alert(message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  function showPosition(position) {
    // Notification.requestPermission().then((permission) => {
    //   if (permission === "granted") {
    //     new Notification("Hello!", {
    //       body: "Notifications are working!",
    //       icon: "/icon.png",
    //     });
    //   }
    // });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    console.log("lat", lat, "lon", lon, "acc", accuracy);

    // if (accuracy > 200) {
    //   setShowCamera(false);
    //   setAllowLocation(false);
    //   alert("GPS signal is weak, Try moving to an open area.");
    //   return false;
    // }

    setAllowLocation(true);
    const coordinates = [lon, lat];
    const obj = { type: "Point", coordinates: coordinates };
    if (!hasPunchedIn) {
      setInputs((prev) => ({ ...prev, punchInGeometry: obj }));
      setCameraMode("punchIn");
    } else {
      setInputs((prev) => ({ ...prev, punchOutGeometry: obj }));
      setCameraMode("punchOut");
    }
    setShowCamera(true);
    return true;
  }

  const handlePunchIn = async () => {
    setLoading(true);
    const coordinates = inputs?.punchInGeometry?.coordinates;
    if (!coordinates || coordinates.length < 2) {
      setLoading(false);
      return;
    }
    const distance = haversine(
      branch.coordinates[1],
      branch.coordinates[0],
      coordinates[1],
      coordinates[0]
    );

    console.log("Distance to branch:", distance);
    if (distance > branch.radius) {
      setLoading(false);
      alert(
        `Distance: ${Math.round(distance)}m should be less than ${
          branch.radius
        }m`
      );
      return;
    }

    if (isAuthenticated && user) {
      axios
        .post(
          "/api/attendance/mark",
          {
            ...inputs,
            userId: user._id,
            companyId: user.roleInfo.company,
            branchId: user.roleInfo.branch,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("Punch In Success:", res.data);
          setHasPunchedIn(true);
          stopCamera();
          navigate("/settings");
        })
        .catch((err) => console.log("Punch In Error:", err))
        .finally(() => {
          setLoading(false);
          setAllowLocation(false);
        });
    }
  };

  const handlePunchOut = async () => {
    setLoading(true);
    const coordinates = inputs?.punchOutGeometry?.coordinates;
    if (!coordinates || coordinates.length < 2) {
      setLoading(false);
      return;
    }
    const distance = haversine(
      branch.coordinates[1],
      branch.coordinates[0],
      coordinates[1],
      coordinates[0]
    );

    console.log("Distance to branch:", distance);
    if (distance > branch.radius) {
      setLoading(false);
      alert(
        `Distance: ${Math.round(distance)}m should be less than ${
          branch.radius
        }m`
      );
      return;
    }

    setHasPunchedIn(false);
    axios
      .put(
        "/api/attendance/mark",
        {
          ...inputs,
          userId: user._id,
          companyId: user.roleInfo.company,
          branchId: user.roleInfo.branch,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log("Punch Out Success:", res.data);
        setHasPunchedIn(false);
        stopCamera();
        navigate("/settings");
      })
      .catch((err) => console.log("Punch Out Error:", err))
      .finally(() => {
        setLoading(false);
        setAllowLocation(false);
      });
  };

  const handleAllowAccess = async () => {
    setDisableBtn(true);
    try {
      const position = await getLocation();
      const isLocation = showPosition(position); // you can still use your existing handler
      if (isLocation) {
        const stream = await startCamera(); // show camera only after location is fetched
        console.log(stream);
      }
    } catch (error) {
      console.error("Error in location/camera access:", error);
    }
    setDisableBtn(false);
  };

  return (
    <div className="min-w-full h-[100vh] cap flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full border-4 border-white/50"></div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setShowCamera(false);
                setAllowLocation(false);
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              disabled={disableBtn}
              className="px-6 py-3 bg-green-500 text-white rounded-full"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
        {!showCamera && (
          <div>
            <h1 className="text-3xl font-bold text-white text-center">
              Attendance
            </h1>
            <p className="mt-4 text-lg text-white/80 text-center">
              {new Date().toDateString()}
            </p>
            <h2 className="text-white/80 text-center mt-4">{`${user?.firstName} ${user?.lastName}`}</h2>
          </div>
        )}

        {/* Display captured photos if available */}
        {inputs.punchInPhoto && !hasPunchedIn && (
          <div className="mt-4 flex justify-center">
            <img
              src={URL.createObjectURL(inputs.punchInPhoto)}
              alt="Punch-in photo"
              className="w-32 h-32 rounded-full object-cover border-2 border-green-500"
            />
          </div>
        )}

        {inputs.punchOutPhoto && hasPunchedIn && (
          <div className="mt-4 flex justify-center">
            <img
              src={URL.createObjectURL(inputs.punchOutPhoto)}
              alt="Punch-out photo"
              className="w-32 h-32 rounded-full object-cover border-2 border-red-500"
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {!allowLocation && (
            <button
              onClick={handleAllowAccess}
              disabled={disableBtn}
              className="px-4 py-2 bg-[#e94560] text-white rounded-lg"
            >
              Allow Access!
            </button>
          )}
          {allowLocation &&
            !hasPunchedIn &&
            !loading &&
            !showCamera &&
            inputs.punchInPhoto && (
              <button
                onClick={handlePunchIn}
                disabled={loading}
                className="px-4 py-2 bg-[#3ded97] text-white rounded-lg"
              >
                Punch In
              </button>
            )}
          {allowLocation &&
            hasPunchedIn &&
            !loading &&
            !showCamera &&
            inputs.punchOutPhoto && (
              <button
                onClick={handlePunchOut}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Punch Out
              </button>
            )}
          {loading && (
            <button disabled className="px-4 py-2 bg-gray-500 text-white">
              Processing...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
