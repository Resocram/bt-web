import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

import { Formik } from 'formik'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import {
  Typography,
  Fade,
  Paper,
  Modal,
  Backdrop,
  CircularProgress,
  Button
} from '@material-ui/core'

import AddPrizeForm from '../components/Forms/AddPrize'
import { fetchBackend } from '../utils'
import { COLOR } from '../constants/Constants'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: COLOR.LIGHT_BACKGROUND_COLOR,
    boxShadow: theme.shadows[5],
    width: 700,
    padding: theme.spacing(2, 4, 3)
  },
  buttonYes: {
    color: COLOR.WHITE,
    backgroundColor: COLOR.SOFT_GREEN,
    marginRight: '20px'
  },
  buttonNo: {
    color: COLOR.WHITE,
    backgroundColor: COLOR.SOFT_RED
  }
}))

const MODAL_TYPES = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
}

export default function PrizesAdmin (props) {
  const classes = useStyles()
  const [prizes, setPrizes] = useState([])
  const [modalType, setModalType] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})
  const [currModifying, setCurrModifying] = useState('')

  const validationSchema = Yup.object({
    id: Yup.string().required(),
    slug: Yup.string().matches(/^[a-z\-0-9]*$/, 'Slug must be lowercase and have no whitespace').required(),
    name: Yup.string().required(),
    price: Yup.number('Valid price required')
      .min(0, 'Non-negative price required')
      .required()
  })

  const initialValues = {
    id: '',
    name: '',
    price: 0,
    imageHash: '',
    links: {}
  }

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = () => {
    fetchBackend('/prizes', 'GET')
      .then(response => {
        response.forEach((prize) => {
          prize.updatedAt = new Date(prize.updatedAt).toLocaleDateString()
        })
        setPrizes(response)
      })
  }

  const openPrizeActionDialogue = (type, rowData) => {
    if (type === MODAL_TYPES.EDIT) {
      setCurrModifying(rowData.id)
    }
    setSelectedRow(rowData)
    setIsModalVisible(true)
    setModalType(type)
  }

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const deletePrize = async (id) => {
    fetchBackend(`/prize/${id}`, 'DELETE')
      .then(() => {
        const tempPrizes = prizes
        tempPrizes.forEach((prize, index) => {
          if (prize.id === id) {
            tempPrizes.splice(index, 1)
          }
        })
        setIsModalVisible(false)
        setPrizes(tempPrizes)
      }).catch((err) => {
        console.log(err)
        alert('An error occured while deleting prize.')
        setIsModalVisible(false)
      })
  }

  function handlePOSTorPATCH (values, isPOST) {
    let price
    try {
      price = parseInt(values.price)
    } catch (err) {
      alert('Price should be an integer')
      return
    }

    const body = {
      id: values.slug,
      name: values.name,
      price: price,
      imageHash: values.imageHash,
      links: values.links
    }
    const endpoint = isPOST ? '' : `/${currModifying}`
    fetchBackend(`/prize${endpoint}`, isPOST ? 'POST' : 'PATCH', body)
      .then(response => {
        const tempPrizes = prizes
        if (isPOST) {
          const createdPrize = response.item
          createdPrize.updatedAt = new Date().toLocaleDateString()
          tempPrizes.push(createdPrize)
        } else {
          for (let i = 0; i < tempPrizes.length; ++i) {
            if (tempPrizes[i].id === body.id) {
              tempPrizes[i] = body
            }
          }
        }
        setPrizes(tempPrizes)
        setIsModalVisible(false)
      })
      .catch(err => {
        alert('An error occurred while trying to create a prize.')
        console.error(err)
      })
  }

  async function submitValues (values) {
    handlePOSTorPATCH(values, true)
  }

  async function updateValues (values) {
    handlePOSTorPATCH(values, false)
  }

  return (
    prizes
      ? (
        <React.Fragment>
          <MaterialTable
            title='BizTech Prizes'
            columns={[
              { title: 'Prize Name', field: 'name' },
              { title: 'Price', field: 'price' },
              { title: 'Image URL', field: 'imageHash' },
              { title: 'Last Edited At', field: 'updatedAt' }
            ]}
            data={prizes}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Prize',
                isFreeAction: true,
                onClick: () => openPrizeActionDialogue(MODAL_TYPES.ADD)
              },
              {
                icon: 'edit',
                tooltip: 'Edit prize',
                onClick: (event, rowData) => openPrizeActionDialogue(MODAL_TYPES.EDIT, rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Prize',
                onClick: (event, rowData) => openPrizeActionDialogue(MODAL_TYPES.DELETE, rowData)
              }
            ]}
            options={{
              search: true,
              draggable: false,
              padding: 'dense',
              pageSize: 15,
              pageSizeOptions: [15, 50, 100],
              actionsColumnIndex: 5,
              exportButton: true,
              headerStyle: {
                fontWeight: 'bold',
                backgroundColor: COLOR.LIGHT_BACKGROUND_COLOR,
                color: COLOR.FONT_COLOR
              },
              rowStyle: rowData => ({})
            }} />
          <Modal
            className={classes.modal}
            open={isModalVisible}
            closeAfterTransition
            onClose={() => handleClose()}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}>
            <Fade in={isModalVisible}>
              {modalType === MODAL_TYPES.ADD
                ? (
                  <Paper className={classes.paper}>
                    <Typography>New Item</Typography>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={submitValues}
                    >
                      {props => <AddPrizeForm {...props}/>}
                    </Formik>
                  </Paper>
                )
                : modalType === MODAL_TYPES.DELETE
                  ? (
                    <Paper className={classes.paper}>
                      <Typography>{`Are you sure you want to delete ${selectedRow.name}?`}</Typography>
                      <div style={{ display: 'flex', marginTop: '20px' }}>
                        <Button className={classes.buttonYes} onClick={() => deletePrize(selectedRow.id)}>Yes</Button>
                        <Button className={classes.buttonNo}>No</Button>
                      </div>
                    </Paper>
                  )
                  : modalType === MODAL_TYPES.EDIT
                    ? (
                      <Paper className={classes.paper}>
                        <Typography>New Item</Typography>
                        <Formik
                          initialValues={selectedRow}
                          validationSchema={validationSchema}
                          onSubmit={updateValues}
                        >
                          {props => <AddPrizeForm {...props}/>}
                        </Formik>
                      </Paper>
                    )
                    : (
                      <div />
                    )}
            </Fade>
          </Modal>
        </React.Fragment>
      )
      : (
        <CircularProgress />
      )
  )
}
