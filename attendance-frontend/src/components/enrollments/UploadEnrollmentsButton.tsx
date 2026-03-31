import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Button, Tooltip} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { api } from '../../api';

type Props = {
  courseId: number;
  onUploaded?: () => void;
  onError?: (message: string) => void;
  title?: string;
};

function UploadEnrollmentsButton({ courseId, onUploaded, onError, title }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const buttonTitle = title ?? t('teacher.enrollments.actions.upload');

  const trigger = () => inputRef.current?.click();

  const handleFileSelected = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    // reset input value to allow re-selecting the same file
    ev.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const resp = await api.courses.uploadEnrollments(courseId, file);
      if (!resp.ok) {
        const body = (await resp.text()).trim();
        throw new Error(body || t('teacher.enrollments.errors.uploadFailed'));
      }
      onUploaded?.();
    } catch (e: any) {
      onError?.(e?.message || t('teacher.enrollments.errors.uploadFailed'));
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
      <Tooltip title={buttonTitle}>
        <span>
          <Button
            aria-label={t('teacher.enrollments.aria.upload')}
            onClick={trigger}
            disabled={uploading}
          >
            <UploadIcon />
            {buttonTitle}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default UploadEnrollmentsButton;
