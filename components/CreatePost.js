import { FaImage, FaVideo } from 'react-icons/fa';

export default function CreatePost() {
  return (
    <div className="card mb-4 p-3">
      <div className="d-flex align-items-start mb-2">
        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-3" style={{ width: 48, height: 48, fontWeight: 600 }}>
          AW
        </div>
        <textarea className="form-control flex-grow-1" rows={2} placeholder="What's on your mind, Alice?" style={{ resize: 'none' }} />
      </div>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light btn-sm d-flex align-items-center gap-2"><FaImage className="text-success" /> Photo</button>
        <button className="btn btn-light btn-sm d-flex align-items-center gap-2"><FaVideo className="text-danger" /> Video</button>
        <button className="btn btn-primary ms-auto">Post</button>
      </div>
    </div>
  );
} 