package com.familja.app;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private TextView text(String value, int size, boolean bold) {
        TextView v = new TextView(this);
        v.setText(value);
        v.setTextSize(size);
        v.setTextColor(Color.rgb(25, 25, 25));
        if (bold) v.setTypeface(null, android.graphics.Typeface.BOLD);
        return v;
    }

    private Button actionButton(String label) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTextSize(17);
        b.setOnClickListener(v ->
                Toast.makeText(this, label + " — po përgatitet", Toast.LENGTH_SHORT).show()
        );
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(54));
        p.topMargin = dp(10);
        b.setLayoutParams(p);
        return b;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ScrollView scroll = new ScrollView(this);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(24), dp(32), dp(24), dp(32));
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setBackgroundColor(Color.WHITE);

        TextView title = text("Familja", 34, true);
        title.setGravity(Gravity.CENTER);
        root.addView(title);

        TextView subtitle = text("Album privat për foto dhe video", 17, false);
        subtitle.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        subParams.topMargin = dp(8);
        subParams.bottomMargin = dp(24);
        subtitle.setLayoutParams(subParams);
        root.addView(subtitle);

        EditText code = new EditText(this);
        code.setHint("Shkruaj kodin e hyrjes");
        code.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        code.setSingleLine(true);
        root.addView(code, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(56)));

        Button enter = actionButton("Hyr");
        enter.setOnClickListener(v -> {
            String entered = code.getText().toString().trim();
            if (entered.isEmpty()) {
                Toast.makeText(this, "Shkruaj kodin", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Hyrja me kod do të lidhet me Firebase në hapin tjetër.", Toast.LENGTH_LONG).show();
            }
        });
        root.addView(enter);

        TextView section = text("Përmbajtja", 21, true);
        LinearLayout.LayoutParams secParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        secParams.topMargin = dp(28);
        section.setLayoutParams(secParams);
        root.addView(section);

        root.addView(actionButton("📷 Fotot"));
        root.addView(actionButton("🎬 Videot"));
        root.addView(actionButton("⬇️ Shkarkimet"));

        TextView admin = text("Vetëm administratori mund të shtojë ose të ndryshojë përmbajtjen.", 14, false);
        LinearLayout.LayoutParams adminParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        adminParams.topMargin = dp(28);
        admin.setLayoutParams(adminParams);
        root.addView(admin);

        scroll.addView(root);
        setContentView(scroll);
    }
}
