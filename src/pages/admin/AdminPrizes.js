import React from 'react'
import PrizesAdmin from '../../components/PrizesAdmin'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'

function AdminPrizes () {
  return (
    <div style={{ paddingLeft: '15%', paddingRight: '15%' }}>
      <Helmet>BizTech Admin Prizes</Helmet>
      <PrizesAdmin />
    </div>
  )
}

export default withRouter(AdminPrizes)
