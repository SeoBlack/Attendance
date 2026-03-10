import {Button, Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    onClick: () => void;
    disabled: boolean;
};

function DeleteEnrollmentsButton({onClick, disabled}: Props) {
    const title = 'Delete enrollments';

    return (
        <Tooltip title={title}>
          <span>
            <Button aria-label="delete-enrollments" onClick={onClick} disabled={disabled} color="error">
                <DeleteIcon/>
                {title}
            </Button>
          </span>
        </Tooltip>
    );
}

export default DeleteEnrollmentsButton;
