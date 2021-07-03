import React from 'react'

import { NavigationBar } from './index'

export default function Layout({ children }) {
    return (
        <>
            <NavigationBar />
            { children }
        </>
    )
}