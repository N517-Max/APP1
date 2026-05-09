
'use server';
/**
 * @fileOverview An AI agent for intelligently assigning drivers to transport requests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransportRequestSchema = z.object({
  requestId: z.string(),
  patientName: z.string(),
  medicalId: z.string().optional(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  requestedTime: z.string(),
  tripType: z.enum(['oneway', 'roundtrip']),
  appointmentType: z.string(),
  patientSpecialNeeds: z.array(z.string()),
  requiredVehicleFeatures: z.array(z.string()),
});

const DriverSchema = z.object({
  driverId: z.string(),
  name: z.string(),
  currentLocation: z.string(),
  isAvailable: z.boolean(),
  certifications: z.array(z.string()),
  vehicleFeatures: z.array(z.string()),
  realtimeTrafficImpact: z.string(),
});

const IntelligentDriverAssignmentInputSchema = z.object({
  transportRequest: TransportRequestSchema,
  availableDrivers: z.array(DriverSchema),
});

const AssignedDriverOutputSchema = z.object({
  driverId: z.string(),
  reasoning: z.string(),
  estimatedArrivalTime: z.string(),
});

const IntelligentDriverAssignmentOutputSchema = z.union([
  AssignedDriverOutputSchema,
  z.object({
    driverId: z.literal('NONE'),
    reasoning: z.string(),
    estimatedArrivalTime: z.literal('N/A'),
  }),
]);

export type IntelligentDriverAssignmentInput = z.infer<typeof IntelligentDriverAssignmentInputSchema>;
export type IntelligentDriverAssignmentOutput = z.infer<typeof IntelligentDriverAssignmentOutputSchema>;

const intelligentDriverAssignmentPrompt = ai.definePrompt({
  name: 'intelligentDriverAssignmentPrompt',
  input: {schema: IntelligentDriverAssignmentInputSchema},
  output: {schema: IntelligentDriverAssignmentOutputSchema},
  prompt: `You are the Dispatch AI for Falls Medride. Analyze the medical transport request and assign the best driver.

Criteria:
1. Vehicle compatibility for special needs (Wheelchair, Oxygen, etc.).
2. Trip Type ({{transportRequest.tripType}}) and Appointment Type ({{transportRequest.appointmentType}}).
3. Proximity and Traffic.
4. Driver Certifications (e.g., BLS for high-risk patients).

Transport Request:
{{{json transportRequest}}}

Available Drivers:
{{{json availableDrivers}}}`,
});

const intelligentDriverAssignmentFlow = ai.defineFlow(
  {
    name: 'intelligentDriverAssignmentFlow',
    inputSchema: IntelligentDriverAssignmentInputSchema,
    outputSchema: IntelligentDriverAssignmentOutputSchema,
  },
  async input => {
    const {output} = await intelligentDriverAssignmentPrompt(input);
    return output!;
  }
);

export async function assignDriver(input: IntelligentDriverAssignmentInput): Promise<IntelligentDriverAssignmentOutput> {
  return intelligentDriverAssignmentFlow(input);
}
