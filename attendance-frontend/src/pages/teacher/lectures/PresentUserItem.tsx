import {Stack, Typography} from "@mui/material";

interface PresentUserItem {
    name: string;
    email: string;
}

export function PresentUserItem({name, email}: PresentUserItem) {
    return (<>
        <Stack direction={"column"}>
            <Typography variant="subtitle2" color="textPrimary">
                {name}
            </Typography>
            <Typography variant="caption" color="textPrimary">
                {email}
            </Typography>
        </Stack>
    </>)
}