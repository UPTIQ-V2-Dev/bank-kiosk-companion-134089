import { type ZodSchema, z } from 'zod';

type TriggerEvent =
    | {
          type: 'async';
          name: string;
          description: string;
      }
    | {
          type: 'sync';
          name: string;
          description: string;
          outputSchema: ZodSchema;
      };

export type AgentConfig = {
    id: string;
    name: string;
    description: string;
    triggerEvents: TriggerEvent[];
    config: {
        appId: string;
        accountId: string;
        widgetKey: string;
    };
};
export const AGENT_CONFIGS: AgentConfig[] = [
    {
        id: '3b4ec709-d050-4020-975a-11c3e24a2516',
        name: 'Product Catalogue Manager',
        description:
            "An AI Agent that manages and understands the organization's product catalogue, providing detailed information and recommendations.",
        triggerEvents: [
            {
                type: 'sync',
                name: 'Information_Request',
                description:
                    'These activate when a user is asking about a specific product or wants product details.\n\nTrigger Keywords:\n\n"tell me about", "details of", "explain", "features of", "what is", "how does", "interest rate of", "eligibility for", "what are the requirements for"',
                outputSchema: z.object({
                    productInfo: z.string(),
                    details: z.array(z.string()).optional(),
                    eligibility: z.string().optional(),
                    interestRate: z.string().optional(),
                    features: z.array(z.string()).optional()
                })
            },
            {
                type: 'sync',
                name: 'Recommendation_Request',
                description:
                    'These activate when a user expresses a need or goal rather than naming a product.\n\nTrigger Keywords:\n\n"I need", "I\'m looking for", "which product is best", "recommend a", "suggest", "what should I choose", "help me find", "ideal for my business"',
                outputSchema: z.object({
                    recommendations: z.array(
                        z.object({
                            productName: z.string(),
                            reason: z.string(),
                            benefits: z.array(z.string()).optional()
                        })
                    ),
                    bestMatch: z.string().optional()
                })
            },
            {
                type: 'sync',
                name: 'Comparison_Request',
                description:
                    'These are for when users want differences or side-by-side comparisons between products.\n\nTrigger Keywords:\n\n"compare", "difference between", "which is better", "vs.", "advantages of", "pros and cons"',
                outputSchema: z.object({
                    comparison: z.array(
                        z.object({
                            productName: z.string(),
                            advantages: z.array(z.string()),
                            disadvantages: z.array(z.string()).optional()
                        })
                    ),
                    recommendation: z.string().optional()
                })
            },
            {
                type: 'sync',
                name: 'Eligibility_Request',
                description:
                    'When users ask if they qualify or what they need to apply.\n\nTrigger Keywords:\n\n"do I qualify", "eligibility criteria", "can I apply", "what documents are required", "requirements for", "minimum credit score", "needed to open"',
                outputSchema: z.object({
                    eligible: z.boolean(),
                    requirements: z.array(z.string()),
                    documentsRequired: z.array(z.string()).optional(),
                    additionalInfo: z.string().optional()
                })
            },
            {
                type: 'sync',
                name: 'Rate_Term_Fee',
                description:
                    'Activate when the user is checking financial parameters or cost.\n\nTrigger Keywords:\n\n"interest rate", "fees", "charges", "minimum deposit", "APR", "loan term", "penalty", "maintenance fee"',
                outputSchema: z.object({
                    rates: z.array(
                        z.object({
                            type: z.string(),
                            rate: z.string(),
                            conditions: z.string().optional()
                        })
                    ),
                    fees: z
                        .array(
                            z.object({
                                feeType: z.string(),
                                amount: z.string(),
                                description: z.string().optional()
                            })
                        )
                        .optional(),
                    terms: z.array(z.string()).optional()
                })
            }
        ],
        config: {
            appId: 'piyali-workspace',
            accountId: 'default-account',
            widgetKey: 'ZU8JIGOK0HdsSZhWS0FHrZh6o31iYe41W4pK7wwr'
        }
    }
];
