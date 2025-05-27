import { FaBell } from 'react-icons/fa';

export default function Topbar() {
  return (
    <header className="d-flex align-items-center justify-content-between bg-white shadow-sm px-4" style={{ height: 64 }}>
      <div className="fw-bold text-primary fs-4">ChitChatter</div>
      <div className="flex-grow-1 mx-4">
        <input type="text" className="form-control" placeholder="Search ChitChatter..." style={{ maxWidth: 400 }} />
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaBell className="fs-4 text-secondary me-3" style={{ cursor: 'pointer' }} />
        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 600 }}>
          AW
        </div>
      </div>
    </header>
  );
} 