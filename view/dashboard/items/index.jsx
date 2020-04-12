import React, { useState, Fragment } from 'react'
import {
    Grid,
    TextField,
    IconButton,
    Box,
    Typography,
    Icon,
    Card,
    CardHeader,
    CardContent,
    CardActionArea
} from '@material-ui/core'

import useSelector from '../../hooks/useSelector'
import useDispatcher, { useProductDispatcher } from '../../hooks/useDispatcher'

import ProductDialog from '../product-dialog'
import style from './style'

export default function Items({ data, onChange }) {
    const classes = style()
    const { dialog } = useSelector()
    const { setDialog } = useDispatcher()
    const { fetchData, resetFilter, resetQuery, setPagination } = useProductDispatcher()

    const [items, setItems] = useState(
        data && data.length
            ? data.map((item) =>
                  Object.assign(item, {
                      productId: (item.product && item.product.publicId) || item.productId,
                      qty: item.qty
                  })
              )
            : []
    )

    const handleUpdate = (items) => {
        onChange(items)
        setItems(items)
    }

    const handleChange = (id) => (e) => {
        const { value } = e.target

        const i = items.findIndex((item) => item.productId === id)

        let updateItems = items

        updateItems[i] = {
            ...updateItems[i],
            qty: value
        }

        handleUpdate(updateItems)
    }

    const handleDelete = (id) => () => {
        const updateItems = items.filter((item) => item.productId !== id)

        handleUpdate(updateItems)
    }

    const handleOpenProductForm = async () => {
        await setPagination({ skip: 0 })
        // await resetFilter()
        // await resetQuery()
        fetchData()
        setDialog({ product: true })
    }

    return (
        <Fragment>
            <Typography>Items</Typography>
            <Grid container spacing={2} alignItems="stretch">
                {items.length
                    ? items.map((item, i) => (
                          <Grid className={classes.item} key={i} item xs={3}>
                              <Card>
                                  <CardHeader
                                      action={
                                          <IconButton size="small" onClick={handleDelete(item.productId)}>
                                              <Icon color="red">delete</Icon>
                                          </IconButton>
                                      }
                                      title={item.product.name}
                                      subheader={
                                          <Box>
                                              sku: {item.product.sku}
                                              <br />
                                              size: {item.product.size}
                                          </Box>
                                      }
                                  />
                                  <CardContent>
                                      <TextField
                                          variant="outlined"
                                          fullWidth
                                          type="number"
                                          label="Quantity"
                                          value={item.qty}
                                          onChange={handleChange(item.productId)}
                                      />
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))
                    : null}
                <Grid className={classes.item} item xs={3}>
                    <Card className={classes.centeredFlex}>
                        <CardActionArea onClick={handleOpenProductForm} className={classes.centeredFlex}>
                            <Box className={classes.centeredFlex}>
                                <Icon>add</Icon>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
            {dialog.product ? <ProductDialog items={items} onChange={handleChange} onUpdate={handleUpdate} /> : null}
        </Fragment>
    )
}
