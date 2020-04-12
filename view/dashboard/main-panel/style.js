import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles((theme) =>
    createStyles({
        tableContainer: {
            position: 'relative',
            height: '65vh'
        },
        darkCell: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
                color: theme.palette.primary.main
            },
            '& .MuiTableSortLabel': {
                '&-root, &:hover, &-active': {
                    color: theme.palette.primary.main
                }
            }
        },
        rows: {
            cursor: 'pointer',
            '&.dark': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 240, 194,0.3)'
                }
            },
            '&.info': {
                backgroundColor: 'rgba(181, 232, 255,0.3)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 240, 194,0.3)'
                }
            },
            '&.success': {
                backgroundColor: 'rgba(171, 255, 207,0.3)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 240, 194,0.3)'
                }
            },
            '&:hover': {
                backgroundColor: 'rgba(255, 240, 194,0.3)'
            }
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1
        },
        marginL: {
            marginLeft: theme.spacing(1)
        },
        chips: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5)
            }
        }
    })
)
