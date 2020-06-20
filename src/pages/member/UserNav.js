import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon
} from "@material-ui/core";
import DateRangeIcon from '@material-ui/icons/DateRange';
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import { connect } from 'react-redux'
import { logout } from '../../actions/UserActions'
import Logo from './images/biztech.svg'

const styles = {
    list: {
        width: '170px',
        paddingTop: '95px',

    },
    icon: {
        width: '49px',
        paddingTop: '28px',
        paddingBottom: '28px',
        cursor: 'pointer',
        paddingLeft: '48px'
    },
    iconSize: {
        fontSize: '30'
    },
    logout: {
        paddingTop: '330px',
        cursor: 'pointer',
        paddingLeft: '48px'
    }
}

function UserNav(props) {
    const history = useHistory();
    const selected = { color: '#7AD040', fontSize: '30', width: '43px' }
    const unselected = { color: '#000000', fontSize: '30', width: '43px' }
    const barSelected = { borderLeft: '6px solid #7AD040', height: '43px', marginTop: '28px', paddingBottom: '28px' }
    const barUnselected = { borderLeft: '6px solid #FFFFFF', height: '43px', marginTop: '28px', paddingBottom: '28px' }
    const [homeBar, setHomeBar] = useState(barSelected)
    const [eventsBar, setEventsBar] = useState(barUnselected)
    const [profileBar, setProfileBar] = useState(barUnselected)
    const [home, setHome] = useState(selected)
    const [events, setEvents] = useState(unselected)
    const [profile, setProfile] = useState(unselected)

    const logout = () => {
        Auth.signOut()
            .then(() => {
                props.logout()
            })
            .catch(err => console.log(err));
    }

    const handleEventsClick = () => {
        history.push('/events/')
        setHome(unselected)
        setHomeBar(barUnselected)
        setEvents(selected)
        setEventsBar(barSelected)
        setProfile(unselected)
        setProfileBar(barUnselected)
    }

    const handleProfileClick = () => {
        history.push('/profile/')
        setHome(unselected)
        setHomeBar(barUnselected)
        setEvents(unselected)
        setEventsBar(barUnselected)
        setProfile(selected)
        setProfileBar(barSelected)
    }

    const handleHomeClick = () => {
        history.push('/userHome/')
        setHome(selected)
        setHomeBar(barSelected)
        setEvents(unselected)
        setEventsBar(barUnselected)
        setProfile(unselected)
        setProfileBar(barUnselected)
    }

    function MenuItem(props) {
        const { label, icon, onClick, bar } = props
        return (
            <ListItem onClick={onClick} aria-label={label}>
                <div style={{ display: 'flex' }}>
                    <div style={bar} />
                    <ListItemIcon style={styles.icon}>
                        {icon}
                    </ListItemIcon>
                </div>

            </ListItem>
        )
    }

    return (
        <div>
            <div style={{ paddingLeft: '170px' }} />
            <Drawer variant='permanent'>
                <List style={styles.list}>
                    <MenuItem label='Home' icon={<img src={Logo} alt='Home' style={home} />} onClick={handleHomeClick} bar={homeBar} />
                    <MenuItem label='Events' icon={<DateRangeIcon style={events} />} onClick={handleEventsClick} bar={eventsBar} />
                    <MenuItem label='Profile' icon={<PersonIcon style={profile} />} onClick={handleProfileClick} bar={profileBar} />
                    <ListItem>
                        <ListItemIcon style={styles.logout} onClick={logout}>
                            <ExitToAppIcon style={styles.iconSize} />
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Drawer>
        </div >
    );
}

export default withRouter(connect(null, { logout })(UserNav));
