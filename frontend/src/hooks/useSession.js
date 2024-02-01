import { createContext, useContext, useState } from 'react'

const SessionContext = createContext(null)

const SetSessionContext = createContext(null)

export function useSession () {
  return [useContext(SessionContext), useContext(SetSessionContext)]
}

export function SessionProvider ({ children }) {
  const [session, setSession] = useState(false)
  return (
    <SessionContext.Provider value={session}>
      <SetSessionContext.Provider value={setSession}>
        {children}
      </SetSessionContext.Provider>
    </SessionContext.Provider>
  )
}