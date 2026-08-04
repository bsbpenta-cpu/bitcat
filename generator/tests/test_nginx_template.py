from pathlib import Path


def test_modal_bootstrap_uses_closing_head_marker():
    template = Path(__file__).parents[2] / "compose" / "nginx.tmpl"
    contents = template.read_text()

    modal_script = '<script src="{{ .BasePath }}/branding/bitcart-modal.js?v=3"></script>'
    closing_head_filter = "sub_filter '</head>' '"

    assert f"{closing_head_filter}{modal_script}" in contents
    assert "sub_filter '<head>'" not in contents
