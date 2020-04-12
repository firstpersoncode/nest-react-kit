import React, { useState, Fragment } from 'react'
import { IconButton, Menu, MenuItem, Icon } from '@material-ui/core'

import useSelector from '../../hooks/useSelector'

export default function ActionsButton({ onEdit, onDelete, onDetail }) {
    const { session, table } = useSelector()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (e) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
    }

    const handleClose = (e) => {
        e.stopPropagation()
        setAnchorEl(null)
    }

    return (
        <Fragment>
            <IconButton size="small" color="secondary" onClick={handleClick}>
                <Icon>more_vert</Icon>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={onDetail}>Detail</MenuItem>
                {session.role >= (table === 'admin' ? 2 : 1)
                    ? [
                          <MenuItem key={0} onClick={onEdit}>
                              Edit
                          </MenuItem>,
                          <MenuItem key={1} onClick={onDelete}>
                              Delete
                          </MenuItem>
                      ]
                    : null}
            </Menu>
        </Fragment>
    )
}
