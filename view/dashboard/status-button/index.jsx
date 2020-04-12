import React, { useState, Fragment } from 'react'
import { Button, Menu, MenuItem, Icon } from '@material-ui/core'

import useSelector from '../../hooks/useSelector'

export default function StatusButton({ children, onChange }) {
    const { mapStatus, session, table } = useSelector()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (e) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
    }

    const handleClose = (e) => {
        e.stopPropagation()
        setAnchorEl(null)
    }

    const handleChangeStatus = (status) => (e) => {
        e.stopPropagation()
        setAnchorEl(null)
        onChange(status)
    }

    return session.role >= (table === 'admin' ? 2 : 1) ? (
        <Fragment>
            <Button size="small" onClick={handleClick} endIcon={<Icon>arrow_drop_down</Icon>}>
                <small>{children}</small>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {mapStatus.map((status, i) => (
                    <MenuItem onClick={handleChangeStatus(i)} key={i} value={i.toString()}>
                        {status}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    ) : (
        <small>{children}</small>
    )
}
