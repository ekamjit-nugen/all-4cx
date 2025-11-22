import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'

export const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
    color: 'white',
    background: "#333b63",
    '&:hover': {
        // backgroundColor: theme.palette[color].main,
        // backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
        opacity: 0.6,
    }
}))

export const StyledToggleButton = styled(MuiToggleButton)(({ theme, color = 'primary' }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: 'white',
        background: "#333b63",
    }
}))
