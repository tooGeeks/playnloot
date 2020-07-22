import React from 'react'
import { Box, Typography, Link as MUILink, Container} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Instagram, WhatsApp, Telegram, GetApp } from '@material-ui/icons'

const styles = {
    a: {
        color: '#FFF',
    },
    Icons: {
        fontSize: 25,
        marginLeft: 5,
        marginRight: 5
    }
}

const Copyright = () => {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Box mb={1} display="flex" justifyContent="center">
                    <a style={styles.a} href="https://api.whatsapp.com/send?phone=+91" target="_blank" rel="noopener noreferrer"><Box><WhatsApp style={styles.Icons}/></Box></a>
                    <a style={styles.a} href="https://#" target="_blank" rel="noopener noreferrer"><Box><Telegram style={styles.Icons}/></Box></a>
                    <a style={styles.a} href="https://#" target="_blank" rel="noopener noreferrer"><Box><Instagram style={styles.Icons}/></Box></a>
                </Box>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <MUILink color="inherit" component={Link} to={'/#welcome'}>
                      Play N Loot
                    </MUILink>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </Container>
    )
}

export default Copyright;