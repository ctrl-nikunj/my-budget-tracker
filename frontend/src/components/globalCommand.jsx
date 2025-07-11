"use client";

import * as React from "react";
import { Box, CreditCard, Loader, Settings, User } from "lucide-react";
import { FaFileInvoice } from "react-icons/fa";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ContactForm } from "./QuickForm";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "./ui/button";

export default function GlobalCommand({ open, setOpen }) {
  const [view, setView] = React.useState("root");
  const [transitioning, setTransitioning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [contact, setContact] = React.useState({
    name: "",
    email: "",
    stdCode: "",
    phone: "",
    type: "customer",
    gstin: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (view === "contacts") {
      if (
        !contact.name ||
        !contact.email ||
        !contact.phone ||
        !contact.address
      ) {
        toast.warning("Please fill the required fields.");
        return;
      }
      if (isNaN(contact.phone)) {
        toast.error("Please enter a valig phone number.");
        return;
      }
      try {
        setLoading(true);
        const fullPhone = `${contact.stdCode}${contact.phone}`;

        const payload = {
          name: contact.name,
          email: contact.email,
          phone: fullPhone, // ✅ send combined phone to API
          type: contact.type,
          gstin: contact.gstin,
          address: contact.address,
        };

        const res = await api.post("/contact", payload);
        if (res.status === 201) {
          toast.success("Contact Saved Successfully!");
          setContact({
            name: "",
            email: "",
            stdCode: "",
            phone: "",
            type: "customer",
            gstin: "",
            address: "",
          });
        }
      } catch (err) {
        toast.error("an error occured");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setView("root"); // Reset view when palette closes
      }}
    >
      {/* Root View */}
      {view === "root" && (
        <div
          className={`font-inter ${transitioning ? "" : "animate-slide-out"}`}
        >
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Business">
              <CommandItem onSelect={() => setView("invoice")}>
                <FaFileInvoice />
                <span>Invoice</span>
              </CommandItem>
              <CommandItem onSelect={() => setView("contacts")}>
                <User />
                <span>Contacts</span>
              </CommandItem>
              <CommandItem onSelect={() => setView("product")}>
                <Box />
                <span>Product</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem
                onSelect={() => console.log("Open Profile settings")}
              >
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => console.log("Open Billing settings")}
              >
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => console.log("Open App settings")}>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      )}

      {/* Contacts View */}
      {view === "contacts" && (
        <div className="p-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-inter font-semibold mt-2 mb-3">Create Contact</h2>
            <button
              className="text-muted-foreground border p-1 rounded"
              onClick={() => {
                setTransitioning(true); // Start animation
                setView("root"); // Show root after animation
                setTransitioning(false);
                // match animation duration
              }}
            >
              ← Back
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <ContactForm
              contact={contact}
              setContact={setContact}
            />
            <Button
              className="w-full my-4 "
              type="submit"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Invoice View */}
      {view === "invoice" && (
        <div className="p-4 animate-slide-in">
          <button
            className="text-muted-foreground border p-1 rounded"
            onClick={() => {
              setTransitioning(true); // Start animation
              setView("root"); // Show root after animation
              setTransitioning(false);
              // match animation duration
            }}
          >
            ← Back
          </button>
          <h3 className="text-lg font-medium mt-2 mb-3">Create Invoice</h3>
          {/* Put your InvoiceForm component here */}
          <p>Form for creating a new invoice goes here.</p>
        </div>
      )}

      {/* Product View */}
      {view === "product" && (
        <div className="p-4 animate-slide-in">
          <button
            className="text-muted-foreground border p-1 rounded"
            onClick={() => {
              setTransitioning(true); // Start animation
              setView("root"); // Show root after animation
              setTransitioning(false);
              // match animation duration
            }}
          >
            ← Back
          </button>
          <h3 className="text-lg font-medium mt-2 mb-3">Create Product</h3>
          {/* Put your ProductForm component here */}
          <p>Form for creating a new product goes here.</p>
        </div>
      )}
    </CommandDialog>
  );
}
