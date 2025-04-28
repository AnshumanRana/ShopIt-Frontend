"use client"

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout';
import ClientLayout from './ClientLayout'; // You'll need to create this

const ADMIN_EMAILS = ['anshumanrana1404@gmail.com']

function AssignRole() {
    const { user, isLoaded } = useUser();
    const [userRole, setUserRole] = useState(null);
    
    useEffect(() => {
        if (!user) return;
        
        const assignRole = async () => {
            const email = user.primaryEmailAddress?.emailAddress;
            const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'client';
            const currentRole = user.unsafeMetadata?.role;
            
            if (currentRole !== role) {
                await user.update({
                    unsafeMetadata: { role },
                });
            }
            
            setUserRole(role);
        }
        
        assignRole();
    }, [user]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please sign in</div>;
    }

    const userRoleToCheck = user?.unsafeMetadata?.role || userRole;
    
    if (userRoleToCheck === 'admin') {
        return <AdminLayout />;
    } else {
        return <ClientLayout />;
    }
}

export default AssignRole;