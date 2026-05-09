'use server';
/**
 * @fileOverview This file provides a Genkit flow for generating a concise summary of a patient's medical needs and transport instructions for drivers.
 *
 * - summarizePatientNeedsForDrivers - A function that generates the summary.
 * - SummarizedPatientNeedsForDriversInput - The input type for the summarizePatientNeedsForDrivers function.
 * - SummarizedPatientNeedsForDriversOutput - The return type for the summarizePatientNeedsForDrivers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizedPatientNeedsForDriversInputSchema = z.object({
  patientMedicalNeeds: z
    .string()
    .describe("A detailed description of the patient's medical needs, including any conditions, medications, or specific care requirements."),
  transportInstructions: z
    .string()
    .describe("Specific instructions for transport, such as wheelchair requirements, oxygen support, preferred seating, or handling procedures."),
  pickupLocation: z.string().describe("The patient's pickup location."),
  dropoffLocation: z.string().describe("The patient's dropoff location."),
  desiredDateTime: z.string().describe("The desired date and time for the transport.")
});
export type SummarizedPatientNeedsForDriversInput = z.infer<
  typeof SummarizedPatientNeedsForDriversInputSchema
>;

const SummarizedPatientNeedsForDriversOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise, AI-generated summary of the patient's key medical needs and critical transport instructions for the driver."
    ),
});
export type SummarizedPatientNeedsForDriversOutput = z.infer<
  typeof SummarizedPatientNeedsForDriversOutputSchema
>;

export async function summarizePatientNeedsForDrivers(
  input: SummarizedPatientNeedsForDriversInput
): Promise<SummarizedPatientNeedsForDriversOutput> {
  return summarizePatientNeedsForDriversFlow(input);
}

const summarizePatientNeedsPrompt = ai.definePrompt({
  name: 'summarizePatientNeedsPrompt',
  input: {schema: SummarizedPatientNeedsForDriversInputSchema},
  output: {schema: SummarizedPatientNeedsForDriversOutputSchema},
  prompt: `As a professional medical transport driver, you need a concise summary of the patient's critical needs and transport instructions.

Generate a summary that highlights the most important medical needs and any specific handling or equipment requirements for the driver. Focus on essential information needed to provide appropriate care and ensure a smooth transport.

Patient Medical Needs: {{{patientMedicalNeeds}}}
Transport Instructions: {{{transportInstructions}}}
Pickup Location: {{{pickupLocation}}}
Dropoff Location: {{{dropoffLocation}}}
Desired Date/Time: {{{desiredDateTime}}}`,
});

const summarizePatientNeedsForDriversFlow = ai.defineFlow(
  {
    name: 'summarizePatientNeedsForDriversFlow',
    inputSchema: SummarizedPatientNeedsForDriversInputSchema,
    outputSchema: SummarizedPatientNeedsForDriversOutputSchema,
  },
  async (input) => {
    const {output} = await summarizePatientNeedsPrompt(input);
    return output!;
  }
);
