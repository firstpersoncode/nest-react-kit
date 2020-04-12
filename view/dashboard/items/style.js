import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles((theme) =>
    createStyles({
        item: {
            minHeight: 200
        },
        centeredFlex: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: theme.palette.grey[200]
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500]
        }
    })
)
