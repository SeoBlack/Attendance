import {Button, Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

type Props = {
    onClick: () => void;
    disabled: boolean;
};

function DeleteEnrollmentsButton({onClick, disabled}: Props) {
    const { t } = useTranslation();
    const title = t('teacher.enrollments.actions.deleteAll');

    return (
        <Tooltip title={title}>
          <span>
            <Button
              aria-label={t('teacher.enrollments.aria.deleteAll')}
              onClick={onClick}
              disabled={disabled}
              color="error"
            >
                <DeleteIcon/>
                {title}
            </Button>
          </span>
        </Tooltip>
    );
}

export default DeleteEnrollmentsButton;
