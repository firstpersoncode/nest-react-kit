import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles(() =>
    createStyles({
        wrapper: {
            '&.blur': {
                filter: 'blur(4px)'
            }
        },
        mainWrapper: {
            height: '100vh',
            position: 'relative',
            paddingTop: 65
        },
        main: {
            '&.blur': {
                filter: 'blur(4px)'
            }
        },
        fixedSideBar: {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%'
        },
        loading: {
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100
        }
    })
)
