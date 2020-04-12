import React from 'react'
import {
    Button,
    Box,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Icon,
    ListItemSecondaryAction
} from '@material-ui/core'

import useSelector from '../../hooks/useSelector'
import useDispatcher, { useAdminDispatcher } from '../../hooks/useDispatcher'

import style from './style'

export default function SideBar() {
    const classes = style()
    const { table, session } = useSelector()
    const { clearNotif } = useAdminDispatcher()
    const { setTable } = useDispatcher(table)

    const handleChangeTable = (table) => async (e) => {
        e.stopPropagation()
        setTable(table)
    }

    const handleClearNotif = (table) => (e) => {
        e.stopPropagation()
        clearNotif(table, session.publicId)
        setTable(table)
    }

    return (
        <Box p={2} boxShadow={4} color="white" bgcolor="secondary.main" className={classes.root}>
            <Toolbar></Toolbar>
            <List>
                {[
                    { label: 'customer', icon: 'person' },
                    { label: 'product', icon: 'description' },
                    { label: 'order', icon: 'move_to_inbox' }
                ].map((item) => (
                    <ListItem
                        key={item.label}
                        variant={table === item.label ? 'contained' : undefined}
                        color="primary"
                        component={Button}
                        onClick={handleChangeTable(item.label)}>
                        <ListItemIcon>
                            <Icon color={table === item.label ? 'secondary' : 'primary'}>{item.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                        {item.label === 'order' && session && session.nto ? (
                            <ListItemSecondaryAction>
                                <Button
                                    className={classes.counts}
                                    size="small"
                                    edge="end"
                                    onClick={handleClearNotif(item.label)}>
                                    {session.nto}
                                </Button>
                            </ListItemSecondaryAction>
                        ) : item.label === 'customer' && session && session.ntc ? (
                            <ListItemSecondaryAction>
                                <Button
                                    className={classes.counts}
                                    size="small"
                                    edge="end"
                                    onClick={handleClearNotif(item.label)}>
                                    {session.ntc}
                                </Button>
                            </ListItemSecondaryAction>
                        ) : null}
                    </ListItem>
                ))}
            </List>

            <List className={classes.bottomList}>
                <ListItem
                    variant={table === 'admin' ? 'contained' : undefined}
                    color="primary"
                    component={Button}
                    onClick={handleChangeTable('admin')}>
                    <ListItemIcon>
                        <Icon color={table === 'admin' ? 'secondary' : 'primary'}>vpn_key</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Access" />
                </ListItem>
            </List>
        </Box>
    )
}
