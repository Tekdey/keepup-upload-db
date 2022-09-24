import { useEffect, useState } from "react";
import axios from "axios";
import { storage } from "./firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function App() {
  const [form, setForm] = useState();
  const [url, setUrl] = useState();
  const [record, setRecord] = useState();

  useEffect(() => {
    setRecord((prevState) => ({ ...prevState, icon: url }));
    if (url) {
      axios.post("http://localhost:8001/post", record).then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("OK");
        }
      });
    }
  }, [url]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setForm(file);
  };

  const handleSubmit = (e, file) => {
    e.preventDefault();
    getImageUrl(file);
    console.log("pass");
  };

  function getImageUrl(file) {
    // Create the file metadata
    /** @type {any} */
    // const metadata = {
    //   contentType: "image/jpeg",
    // };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "icon/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, file); // metadata

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at");
          setUrl(downloadURL);
        });
      }
    );
  }

  return (
    <div className="App">
      <form onSubmit={(e) => handleSubmit(e, form)}>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          onChange={(e) =>
            setRecord((prevState) => ({
              ...prevState,
              category: e.target.value,
            }))
          }
        />
        <label htmlFor="sport">Sport</label>
        <input
          type="text"
          id="sport"
          onChange={(e) =>
            setRecord((prevState) => ({ ...prevState, sport: e.target.value }))
          }
        />

        <input type="file" name="image" id="image" onChange={handleChange} />
        <button>SEND</button>
      </form>
      <div>
        <img src="" alt="" />
      </div>
    </div>
  );
}

export default App;
