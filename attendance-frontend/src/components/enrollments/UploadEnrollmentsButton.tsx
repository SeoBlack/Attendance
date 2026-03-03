import { useRef, useState } from 'react';
import {Button, Tooltip} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { api } from '../../api';

type Props = {
  courseId: number;
  onUploaded?: () => void;
  onError?: (message: string) => void;
  title?: string;
};

function UploadEnrollmentsButton({ courseId, onUploaded, onError, title = 'Upload enrollments' }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const trigger = () => inputRef.current?.click();

  const handleFileSelected = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    // reset input value to allow re-selecting the same file
    ev.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const resp = await api.courses.uploadEnrollments(courseId, file);
      if (!resp.ok) throw new Error((await resp.text()) || 'Failed to upload enrollments');
      onUploaded?.();
    } catch (e: any) {
      onError?.(e?.message || 'Failed to upload enrollments');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xml, application/xml"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      <Tooltip title={title}>
        <span>
          <Button aria-label="upload-enrollments" onClick={trigger} disabled={uploading}>
            <UploadIcon />
            Upload enrollments
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default UploadEnrollmentsButton;
