import { useState } from "react";

function Block({ index }: any) {
  const [file, setFile] = useState<any>();

  const captureFile = (event: any) => {
    console.log(event);
    
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setFile(Buffer.from(reader.result as any));
    };
  };

  const handleUploadFile = () => {
    console.log("index", index);
  };

  return (
    <div className="border border-black p-5 aspect-square">
      <label className="input-group w-min">
        <input
          type="file"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
file:text-sm file:font-semibold
file:bg-secondary file:text-violet-900
hover:file:bg-secondary-focus hover:file:text-violet-300"
          onChange={captureFile}
          accept="image/*, video/*"
        />
      </label>
      <button className="my-3 retro-btn" onClick={handleUploadFile}>
        Upload File
      </button>
    </div>
  );
}

export default Block;
