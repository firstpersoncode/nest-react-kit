import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles((theme) =>
    createStyles({
        root: {
            position: 'relative',
            height: '100vh',
            overflowY: 'auto',
            zIndex: theme.zIndex.drawer
        },
        bottomList: {
            width: 'inherit',
            position: 'absolute',
            bottom: theme.spacing(2),
            left: theme.spacing(2),
            right: theme.spacing(2)
        },
        counts: {
            backgroundColor: 'red',
            color: 'white',
            minWidth: 0
        }
    })
)
