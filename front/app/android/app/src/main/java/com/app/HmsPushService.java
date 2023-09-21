package com.travelpal;

import com.travelpal.MainActivity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.media.RingtoneManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.huawei.hms.push.HmsMessageService;
import com.huawei.hms.push.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import android.net.Uri;


public class HmsPushService extends HmsMessageService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // data object ( needs rest apis )
        handleNotificationFromDataObject(remoteMessage);

        // notification object ( default notification object )
        handleNotificationFromNotificationObject(remoteMessage);
    }

    private void handleNotificationFromDataObject(RemoteMessage remoteMessage) {
        try {
            JSONObject jsonData = new JSONObject(remoteMessage.getData());
            String title = jsonData.getString("title");
            String message = jsonData.getString("message");
            if (!title.isEmpty() && !message.isEmpty()) {
                sendNotification(title, message);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void handleNotificationFromNotificationObject(RemoteMessage remoteMessage) {
        String title = remoteMessage.getNotification().getTitle();
        String message = remoteMessage.getNotification().getBody();
        if (!title.isEmpty() && !message.isEmpty()) {
            sendNotification(title, message);
        }
    }

    private void sendNotification(String title, String message) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        String CHANNEL_ID = "Push-Kit-test";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel mChannel = new NotificationChannel(
                    CHANNEL_ID, CHANNEL_ID, NotificationManager.IMPORTANCE_HIGH
            );
            notificationManager.createNotificationChannel(mChannel);
        }

        Intent notifyIntent = new Intent(this, MainActivity.class);
        notifyIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

        PendingIntent notifyPendingIntent = PendingIntent.getActivity(
                this,
                0,
                notifyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
        );

        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setPriority(NotificationManager.IMPORTANCE_HIGH)
                .setDefaults(Notification.DEFAULT_ALL)
                .setContentIntent(notifyPendingIntent);

        notificationBuilder.setContentText(message);
        notificationManager.notify(
                String.valueOf(System.currentTimeMillis()),
                0,
                notificationBuilder.build()
        );
    }
}