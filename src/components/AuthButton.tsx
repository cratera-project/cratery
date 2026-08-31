import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PixelButton } from './ui/PixelButton'
import { AuthModal } from './AuthModal'
import { avatarUrl } from '../lib/avatar'
import { listNotifications } from '../lib/notifications'

export function AuthButton() {
    const { user, profile, loading } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [unread, setUnread] = useState(0)

    useEffect(() => {
        if (!user) {
            setUnread(0)
            return
        }
        let cancelled = false
        listNotifications().then(({ unread: n }) => {
            if (!cancelled) setUnread(n)
        })
        return () => {
            cancelled = true
        }
    }, [user])

    if (loading) {
        return (
            <div className="h-[42px] w-[42px] animate-pulse border-3 border-black/60 bg-night-raised" />
        )
    }

    if (user) {
        const username = profile?.username ?? user.username ?? 'User'
        const pfp = avatarUrl(user.id, profile?.avatar)

        return (
            <Link to="/profile" title={username} className="relative">
                <div className="h-[42px] w-[42px] cursor-pointer border-3 border-black/60 bg-night-raised shadow-pixel transition-all duration-100 hover:-translate-y-0.5 hover:shadow-pixel-lg">
                    <img
                        src={pfp}
                        alt={username}
                        className="h-full w-full"
                        loading="lazy"
                    />
                </div>
                {unread > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center border-2 border-black/60 bg-rust-orange px-0.5 font-pixel text-[8px] text-white">
                        {unread > 9 ? '9+' : unread}
                    </span>
                ) : null}
            </Link>
        )
    }

    return (
        <>
            <PixelButton size="sm" className="shrink-0 !h-[42px] !border-3 !px-3 !py-2.5 text-[11px] leading-none" onClick={() => setShowModal(true)}>
                Login
            </PixelButton>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}
