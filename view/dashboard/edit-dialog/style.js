import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles((theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            right: theme.spacing(2),
            top: theme.spacing(1),
            color: theme.palette.grey[500]
        },
        header: {
            position: 'relative',
            backgroundColor: theme.palette.secondary.main,
            color: 'white'
        },
        form: {
            '&.loading': {
                filter: 'blur(4px)'
            }
        }
    })
)
