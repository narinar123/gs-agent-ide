import os
import urllib.request
import json

def zapier_nla_action(action_name: str, instructions: str) -> str:
    """Triggers a Zapier Natural Language Action (NLA) such as sending an email or Slack message.
    
    Args:
        action_name: The name of the configured Zapier action, e.g. "Send Gmail"
        instructions: Natural language instructions for the action, e.g. "Email boss stating project is complete"
    """
    api_key = os.getenv("ZAPIER_NLA_API_KEY", "")
    if not api_key:
        return f"[Simulated Zapier NLA Action]: Action '{action_name}' executed successfully with instructions: '{instructions}'. (Set ZAPIER_NLA_API_KEY to trigger live Zaps)."

    try:
        req = urllib.request.Request(
            "https://nla.zapier.com/api/v1/exposed/",
            data=json.dumps({"action": action_name, "instructions": instructions}).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            return f"Zapier Action Executed: {res.get('result', 'Success')}"
    except Exception as e:
        return f"Error executing Zapier action: {str(e)}"

def trigger_n8n_webhook(webhook_url: str, payload_json: str) -> str:
    """Triggers an n8n workflow webhook with custom payload data.
    
    Args:
        webhook_url: The full webhook URL configured in your n8n workflow.
        payload_json: A JSON string containing the data payload.
    """
    try:
        data = json.loads(payload_json)
        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            return f"n8n Webhook Triggered. Status Code: {response.status}. Response: {response.read().decode()}"
    except Exception as e:
        return f"Error triggering n8n webhook: {str(e)}"

def manage_ecommerce_store(operation: str, data_json: str) -> str:
    """Manages e-commerce operations like adding products, reading inventory, or processing orders.
    
    Args:
        operation: The operation to perform: 'add_product', 'get_inventory', or 'create_order'
        data_json: A JSON string with product/order details.
    """
    try:
        data = json.loads(data_json)
        # Simulation of an e-commerce backend connection (Shopify, WooCommerce, etc.)
        return f"[Simulated E-commerce]: Successfully performed '{operation}' with data: {data}"
    except Exception as e:
        return f"Error managing e-commerce store: {str(e)}"
