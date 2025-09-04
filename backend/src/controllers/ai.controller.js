const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../services/ai.service');
const router = express.Router();

/**
 * POST /ai/generate-suggestions
 * Generate AI suggestions for task creation based on natural language input
 */
router.post('/generate-suggestions', 
    [
        body('input')
            .notEmpty()
            .withMessage('Input is required')
            .isLength({ min: 3, max: 200 })
            .withMessage('Input must be between 3 and 200 characters')
            .trim()
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { input } = req.body;

            // Check if AI service is properly configured
            if (!aiService.isConfigured()) {
                return res.status(503).json({
                    success: false,
                    message: 'AI service is not configured. Please check API key.',
                    fallback: {
                        title: aiService.generateFallbackTitle(input),
                        description: aiService.generateFallbackDescription(input)
                    }
                });
            }

            // Generate AI suggestions
            const result = await aiService.generateTaskSuggestions(input);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'AI suggestions generated successfully',
                    data: result.data
                });
            } else {
                // Return fallback suggestions if AI fails
                res.status(200).json({
                    success: true,
                    message: 'AI service temporarily unavailable, using fallback suggestions',
                    data: result.fallback
                });
            }

        } catch (error) {
            console.error('AI Controller Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
);

/**
 * GET /ai/health
 * Check if AI service is properly configured and working
 */
router.get('/health', async (req, res) => {
    try {
        const isConfigured = aiService.isConfigured();
        
        res.status(200).json({
            success: true,
            configured: isConfigured,
            message: isConfigured ? 'AI service is ready' : 'AI service needs API key configuration'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'AI service health check failed',
            error: error.message
        });
    }
});

module.exports = router;
