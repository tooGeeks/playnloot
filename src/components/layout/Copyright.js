import React from 'react'
import { Box, Typography, Link as MUILink, Container} from '@material-ui/core'
import { Link } from 'react-router-dom'

const Copyright = () => {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Box fontSize={12}></Box>
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