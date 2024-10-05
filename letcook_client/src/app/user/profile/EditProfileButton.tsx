import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import EditProfileForm from "./EditProfileForm";


export default function EditProfileButton({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);


    return (
       <>
         <InteractiveOverlay
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={""}
            description={""}
            form={<EditProfileForm userId={userId} />}
        />
        <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
       </>
    )
}