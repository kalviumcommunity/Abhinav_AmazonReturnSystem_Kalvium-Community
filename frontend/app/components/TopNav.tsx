"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <div className="top-nav__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5s9.5 4.253 9.5 9.5z" stroke="#FF9900" strokeWidth="1.5"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="top-nav__title">
            Amazon <span className="top-nav__title-accent">Seller Central</span>
          </span>
        </div>
      </div>

      <div className="top-nav__search">
        <svg className="top-nav__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search returns, orders, products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="top-nav__search-input"
        />
      </div>

      <div className="top-nav__actions">
        <button className="top-nav__icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="top-nav__badge">3</span>
        </button>

        <div className="top-nav__profile-container" ref={dropdownRef}>
          <div 
            className="top-nav__profile" 
            onClick={() => setShowDropdown(!showDropdown)}
            role="button"
            tabIndex={0}
          >
            <div className="top-nav__avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <span className="top-nav__seller-name">{user?.name || "Seller"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {showDropdown && (
            <div className="top-nav__dropdown">
              <div className="top-nav__dropdown-header">
                <p className="top-nav__dropdown-name">{user?.name || "Seller"}</p>
                <p className="top-nav__dropdown-email">{user?.email || ""}</p>
              </div>
              <button className="top-nav__dropdown-item" onClick={logout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
