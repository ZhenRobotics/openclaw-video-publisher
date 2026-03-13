/**
 * Advanced Usage Example - Agent Audit Trail
 * Demonstrates detailed decision recording with reasoning steps
 */

import { AgentAuditTrail } from '../src/core/audit-trail';

async function main() {
  console.log('Agent Audit Trail - Advanced Example\n');

  // Initialize
  const trail = new AgentAuditTrail({
    agentId: 'advanced-agent',
    agentVersion: '2.0.0',
    storagePath: './examples/data'
  });

  await trail.initialize();

  // Example 1: Image Classification Decision
  console.log('Example 1: Image Classification\n');

  const imageEntry = await trail.recordDecision(
    // Input
    {
      prompt: 'Classify image: cat_photo.jpg',
      context: {
        imageUrl: 'https://example.com/images/cat_photo.jpg',
        imageSize: '1024x768',
        format: 'JPEG'
      },
      parameters: {
        model: 'resnet50',
        confidence_threshold: 0.8
      }
    },
    // Reasoning
    {
      steps: [
        {
          step: 1,
          action: 'preprocess',
          thought: 'Resize image to 224x224 for model input',
          observation: 'Image resized successfully',
          timestamp: Date.now()
        },
        {
          step: 2,
          action: 'inference',
          thought: 'Run image through ResNet50 model',
          observation: 'Model predictions: cat (95%), dog (3%), bird (2%)',
          timestamp: Date.now() + 50
        },
        {
          step: 3,
          action: 'threshold_check',
          thought: 'Check if top prediction exceeds confidence threshold',
          observation: 'Cat prediction (95%) > threshold (80%)',
          timestamp: Date.now() + 100
        },
        {
          step: 4,
          action: 'decide',
          thought: 'Select cat as final classification',
          timestamp: Date.now() + 120
        }
      ],
      model: 'resnet50',
      temperature: 0.0
    },
    // Output
    {
      decision: 'cat',
      confidence: 0.95,
      alternatives: [
        { decision: 'dog', confidence: 0.03, reasoning: 'Second highest but below threshold' },
        { decision: 'bird', confidence: 0.02, reasoning: 'Low confidence, not considered' }
      ],
      metadata: {
        processingTime: '120ms',
        modelVersion: 'v1.5'
      }
    },
    // Execution time
    120,
    // Cost (if using paid API)
    {
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0.001
    }
  );

  console.log(`  ✓ Image classification recorded: ${imageEntry.id}`);
  console.log(`  Decision: ${imageEntry.output.decision} (confidence: ${imageEntry.output.confidence})`);
  console.log(`  Hash: ${imageEntry.hash.substring(0, 16)}...\n`);

  // Example 2: Financial Approval Decision
  console.log('Example 2: Loan Approval\n');

  const loanEntry = await trail.recordDecision(
    // Input
    {
      prompt: 'Approve loan application #12345',
      context: {
        applicantId: 'user_789',
        loanAmount: 50000,
        purpose: 'home_improvement',
        creditScore: 720,
        annualIncome: 80000,
        debtToIncomeRatio: 0.3,
        employmentYears: 5
      },
      parameters: {
        minCreditScore: 650,
        maxDebtRatio: 0.4,
        minEmploymentYears: 2
      }
    },
    // Reasoning
    {
      steps: [
        {
          step: 1,
          action: 'verify_identity',
          thought: 'Verify applicant identity and documentation',
          observation: 'Identity verified, all documents present',
          timestamp: Date.now()
        },
        {
          step: 2,
          action: 'check_credit_score',
          thought: 'Compare credit score against minimum threshold',
          observation: 'Credit score 720 > minimum 650 ✓',
          timestamp: Date.now() + 200
        },
        {
          step: 3,
          action: 'analyze_debt_ratio',
          thought: 'Calculate and verify debt-to-income ratio',
          observation: 'Debt ratio 0.3 < maximum 0.4 ✓',
          timestamp: Date.now() + 400
        },
        {
          step: 4,
          action: 'check_employment',
          thought: 'Verify employment stability',
          observation: '5 years employment > minimum 2 years ✓',
          timestamp: Date.now() + 600
        },
        {
          step: 5,
          action: 'risk_assessment',
          thought: 'Calculate overall risk score',
          observation: 'Risk score: LOW (all criteria met)',
          timestamp: Date.now() + 800
        },
        {
          step: 6,
          action: 'decide',
          thought: 'All criteria satisfied, approve loan',
          timestamp: Date.now() + 1000
        }
      ],
      model: 'loan-approval-v2',
      temperature: 0.0
    },
    // Output
    {
      decision: 'approved',
      confidence: 0.92,
      alternatives: [
        {
          decision: 'manual_review',
          confidence: 0.08,
          reasoning: 'Borderline case could benefit from human review'
        }
      ],
      metadata: {
        approvedAmount: 50000,
        interestRate: 0.045,
        termMonths: 120,
        monthlyPayment: 518.66,
        riskCategory: 'LOW'
      }
    },
    1000,
    {
      inputTokens: 250,
      outputTokens: 100,
      totalCost: 0.005
    }
  );

  console.log(`  ✓ Loan approval recorded: ${loanEntry.id}`);
  console.log(`  Decision: ${loanEntry.output.decision} (confidence: ${loanEntry.output.confidence})`);
  console.log(`  Risk: ${loanEntry.output.metadata?.riskCategory}`);
  console.log(`  Hash: ${loanEntry.hash.substring(0, 16)}...\n`);

  // Example 3: Content Moderation
  console.log('Example 3: Content Moderation\n');

  const moderationEntry = await trail.recordDecision(
    {
      prompt: 'Moderate user comment: "This product is amazing! Highly recommend."',
      context: {
        userId: 'user_456',
        platform: 'product_reviews',
        userReputation: 'trusted',
        previousViolations: 0
      }
    },
    {
      steps: [
        {
          step: 1,
          action: 'scan_profanity',
          thought: 'Check for profanity and offensive language',
          observation: 'No profanity detected',
          timestamp: Date.now()
        },
        {
          step: 2,
          action: 'detect_spam',
          thought: 'Analyze for spam patterns',
          observation: 'No spam indicators found',
          timestamp: Date.now() + 100
        },
        {
          step: 3,
          action: 'check_toxicity',
          thought: 'Run toxicity detection model',
          observation: 'Toxicity score: 0.02 (very low)',
          timestamp: Date.now() + 200
        },
        {
          step: 4,
          action: 'verify_authenticity',
          thought: 'Check for bot-like behavior',
          observation: 'Human-like patterns detected',
          timestamp: Date.now() + 300
        },
        {
          step: 5,
          action: 'decide',
          thought: 'Content passes all checks, approve',
          timestamp: Date.now() + 350
        }
      ],
      model: 'content-moderator-v3'
    },
    {
      decision: 'approved',
      confidence: 0.98,
      metadata: {
        toxicityScore: 0.02,
        spamScore: 0.01,
        sentiment: 'positive'
      }
    },
    350
  );

  console.log(`  ✓ Moderation decision recorded: ${moderationEntry.id}`);
  console.log(`  Decision: ${moderationEntry.output.decision}`);
  console.log(`  Toxicity: ${moderationEntry.output.metadata?.toxicityScore}\n`);

  // Verify entire chain
  console.log('Verifying chain integrity...');
  const verification = trail.verify();
  console.log(`  ${verification.valid ? '✓' : '✗'} Chain valid: ${verification.verifiedEntries}/${verification.totalEntries} entries\n`);

  // Export as JSON
  console.log('Exporting as JSON...');
  const jsonExport = await trail.export({
    format: 'json',
    includeMetadata: true,
    includeReasoning: true
  });
  console.log(`  ✓ Export size: ${jsonExport.length} bytes\n`);

  // Query recent decisions
  const recent = await trail.query({ limit: 5 });
  console.log(`Recent decisions: ${recent.length}`);
  recent.forEach((entry, i) => {
    console.log(`  ${i + 1}. ${entry.output.decision} - ${entry.input.prompt?.substring(0, 50)}...`);
  });

  await trail.close();
  console.log('\n✓ Advanced example completed!');
}

main().catch(console.error);
