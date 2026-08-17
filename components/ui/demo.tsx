import React from 'react';
import { Cta1 } from "./index";

export default function Cta1Demo() {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
      <Cta1
        title="Supercharge your team's productivity"
        description="Unlock all premium features today and take your workflow to the next level."
        buttonText="Get Started Now"
        buttonLink="https://wa.me/917012028379"
      />
    </div>
  );
}
