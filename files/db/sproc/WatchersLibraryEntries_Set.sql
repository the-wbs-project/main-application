DROP PROCEDURE IF EXISTS [dbo].[WatchersLibraryEntries_Set]
GO

CREATE PROCEDURE [dbo].[WatchersLibraryEntries_Set]
	@WatcherId [nvarchar](100),
	@OwnerId [nvarchar](100),
	@EntryId [nvarchar](100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	MERGE INTO [dbo].[WatchersLibraryEntries] link
        USING (VALUES (@WatcherId, @OwnerId, @EntryId)) AS source (WatcherId, OwnerId, EntryId)
		ON link.WatcherId = source.WatcherId AND link.OwnerId = source.OwnerId AND link.EntryId = source.EntryId
		WHEN NOT MATCHED THEN
			INSERT VALUES (source.WatcherId, source.OwnerId, source.EntryId);
END
